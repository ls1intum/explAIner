import { defineConfig, devices } from '@playwright/test';
import { PRACTICE_TIMEOUT_MS } from './tests/config';

/**
 * Playwright config for the ExplAIner smoke tests.
 *
 * Target selection (no server is started by Playwright — the app always runs
 * in Docker or on the VM):
 *   E2E_BASE_URL        default http://localhost:3000 (docker-compose.dev.yml)
 *   E2E_ACCESS_TOKEN    value of SITE_ACCESS_TOKEN when the soft gate is on
 *                       (production); leave unset for local dev.
 *
 * See e2e/README.md for the full list of knobs.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // Each explainer test waits for a real LLM practice generation, so keep the
  // worker count low enough not to hammer the LLM endpoint with parallel runs.
  workers: process.env.CI ? 2 : 3,
  // The per-test budget must cover the practice wait plus page load and asserts.
  timeout: PRACTICE_TIMEOUT_MS + 60_000,
  expect: { timeout: 15_000 },
  reporter: process.env.CI
    ? [['github'], ['list'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
    actionTimeout: 15_000,
    navigationTimeout: 60_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
