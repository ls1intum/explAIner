import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';
import {
  ABSENCE_GRACE_MS,
  EXPECTED_CAPABILITIES,
  GROUPS,
  LANGS,
  MATERIAL_HEADING,
  PRACTICE_TIMEOUT_MS,
  SECTION,
  sigilUrl,
  TEST_TOKEN,
} from './config';

/**
 * Smoke test for the three study groups x two languages.
 *
 * For every combination it checks the three things that must hold for the
 * study to be usable at all:
 *   1. the learning material was loaded and rendered,
 *   2. the Owlbert chat is present for chat/explainer and absent for text,
 *   3. the practice ("Weiter"/"Continue") button appears for explainer within
 *      PRACTICE_TIMEOUT_MS and never appears for the other two groups.
 *
 * Each run creates one real session per combination (and, for explainer, one
 * real LLM practice generation) in whatever database the target points at.
 * Those sessions are flagged `is_test_run = true` and deleted again in the
 * fixture teardown - see fixtures.ts.
 */

/** Fails the test on any uncaught exception in the page. */
function trackPageErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(err.message));
  return errors;
}

for (const group of GROUPS) {
  for (const lang of LANGS) {
    const { hasChat, hasPractice } = EXPECTED_CAPABILITIES[group];

    test(`sigil ${group}/${SECTION} [${lang}]`, async ({ page, createdSessions }) => {
      const pageErrors = trackPageErrors(page);

      await page.goto(sigilUrl(group, SECTION, lang));

      // --- 1. Material loaded ------------------------------------------------
      // The access gate returns a 401 page instead of the app when the token is
      // missing or wrong - surface that as a clear failure, not a timeout.
      await expect(
        page.getByRole('heading', { name: 'Zugang erforderlich' }),
        'access gate blocked the request - check E2E_ACCESS_TOKEN',
      ).toHaveCount(0);

      const informBlock = page.getByTestId('inform-block');
      await expect(informBlock, 'inform block did not render').toBeVisible({ timeout: 60_000 });

      const material = page.getByTestId('inform-block-material');
      await expect(material).toBeVisible();
      await expect(
        material.getByRole('heading', { name: MATERIAL_HEADING[SECTION][lang] }),
        'learning material heading missing',
      ).toBeVisible();

      // The requested language actually took effect.
      await expect(page.locator('html')).toHaveAttribute('lang', lang);

      // --- 2. Chat only for chat/explainer -----------------------------------
      const chatInput = page.getByTestId('chat-input');
      if (hasChat) {
        await expect(chatInput, `chat missing for group "${group}"`).toBeVisible();
        await expect(chatInput).toBeEnabled();
      } else {
        await page.waitForTimeout(ABSENCE_GRACE_MS);
        await expect(chatInput, `chat leaked into group "${group}"`).toHaveCount(0);
        // Guard against passing because the page died in the meantime.
        await expect(informBlock).toBeVisible();
      }

      // --- 3. Practice button only for explainer -----------------------------
      const continueButton = page.getByTestId('inform-block-continue');
      if (hasPractice) {
        await expect(
          continueButton,
          `practice button did not appear within ${PRACTICE_TIMEOUT_MS} ms`,
        ).toBeVisible({ timeout: PRACTICE_TIMEOUT_MS });
        await expect(continueButton).toBeEnabled();
      } else {
        await page.waitForTimeout(ABSENCE_GRACE_MS);
        await expect(
          continueButton,
          `practice button leaked into group "${group}"`,
        ).toHaveCount(0);
        await expect(page.getByTestId('inform-block-preparing-practice')).toHaveCount(0);
      }

      // --- 4. Session is flagged as test data --------------------------------
      // Only meaningful when a secret is configured; without one the server
      // deliberately refuses to mark anything.
      if (TEST_TOKEN) {
        await expect
          .poll(() => createdSessions.length, { message: 'no session creation observed' })
          .toBeGreaterThan(0);
        expect(
          createdSessions.map((s) => s.isTestRun),
          'session was not flagged as a test run - is E2E_TEST_TOKEN identical on server and test?',
        ).not.toContain(false);
      }

      expect(pageErrors, 'uncaught errors in the page').toEqual([]);
    });
  }
}
