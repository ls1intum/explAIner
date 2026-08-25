import { test as base } from '@playwright/test';
import { CLEANUP_ENABLED, TEST_TOKEN, TEST_TOKEN_HEADER } from './config';

export interface CreatedSession {
  sessionId: string;
  /** Whether the server accepted the smoke-test secret and flagged the row. */
  isTestRun: boolean;
  /** API root that created it, e.g. "http://localhost:3001/api". */
  apiBaseUrl: string;
}

interface SmokeFixtures {
  /** Sessions this test created, in creation order. */
  createdSessions: CreatedSession[];
}

/**
 * Test fixture that keeps the study data clean:
 *
 *  - every browser request carries the E2E_TEST_TOKEN header, so the server
 *    stores the session with `is_test_run = true`;
 *  - every session the test created is deleted again after the test, whether
 *    it passed or failed.
 *
 * The two are deliberately belt-and-braces: cleanup is the normal path, the
 * marker is what makes leftovers from a crashed run findable
 * (`SELECT ... WHERE is_test_run = true`).
 */
export const test = base.extend<SmokeFixtures>({
  context: async ({ context }, use) => {
    if (TEST_TOKEN) {
      await context.setExtraHTTPHeaders({ [TEST_TOKEN_HEADER]: TEST_TOKEN });
    }
    await use(context);
  },

  createdSessions: [
    async ({ page, request }, use, testInfo) => {
      const created: CreatedSession[] = [];
      const parsed: Promise<unknown>[] = [];

      // The client creates the session itself, so we learn the id by watching
      // its POST to the API - which also tells us the API root to delete from,
      // no extra configuration needed.
      page.on('response', (response) => {
        if (response.request().method() !== 'POST') return;
        const url = new URL(response.url());
        if (!url.pathname.endsWith('/sigil/sessions')) return;

        parsed.push(
          response
            .json()
            .then((body: { sessionId?: string; isTestRun?: boolean }) => {
              if (!body?.sessionId) return;
              created.push({
                sessionId: body.sessionId,
                isTestRun: body.isTestRun === true,
                apiBaseUrl: `${url.origin}${url.pathname.replace(/\/sigil\/sessions$/, '')}`,
              });
            })
            // A non-JSON or already-consumed body must not fail the test here;
            // the assertions in the spec cover whether creation worked.
            .catch(() => undefined),
        );
      });

      await use(created);

      await Promise.allSettled(parsed);

      if (!CLEANUP_ENABLED) {
        testInfo.annotations.push({
          type: 'cleanup-skipped',
          description: created.map((s) => s.sessionId).join(', ') || 'no sessions created',
        });
        return;
      }

      const failures: string[] = [];
      for (const session of created) {
        try {
          const response = await request.delete(
            `${session.apiBaseUrl}/sessions/${session.sessionId}`,
            { failOnStatusCode: false },
          );
          if (!response.ok()) failures.push(`${session.sessionId} -> HTTP ${response.status()}`);
        } catch (error) {
          failures.push(`${session.sessionId} -> ${(error as Error).message}`);
        }
      }

      // Fail loudly rather than leaving rows behind unnoticed: a leftover
      // session in the production database is exactly what this is meant to
      // prevent. Find survivors with: SELECT * FROM sessions WHERE is_test_run;
      if (failures.length > 0) {
        failures.forEach((description) =>
          testInfo.annotations.push({ type: 'cleanup-failed', description }),
        );
        throw new Error(
          `Failed to delete ${failures.length} smoke-test session(s): ${failures.join('; ')}`,
        );
      }
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';
