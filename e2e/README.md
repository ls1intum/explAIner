# E2E smoke tests

Playwright smoke test for the sigil study pages: **3 groups × 2 languages**.
For every combination it asserts

1. the learning material loaded and rendered,
2. the Owlbert chat is present in `chat` / `explainer` and absent in `text`,
3. the practice button appears in `explainer` within N seconds and never in the
   other two groups.

The suite never starts the app itself — it always points at a running instance
(local docker stack or the production VM).

## Run locally

Start the stack first:

```bash
docker compose -f docker-compose.dev.yml --env-file .env.dev up --build
```

Then, from `e2e/`:

```bash
npm ci && npx playwright install --with-deps chromium && npm test
```

If `SITE_ACCESS_TOKEN` is set in `.env.dev`, pass the same value as
`E2E_ACCESS_TOKEN` (it is appended to the URL as `?token=`, the way the survey
embeds it).

## Run against production

```bash
E2E_BASE_URL=https://explainer.aet.cit.tum.de E2E_ACCESS_TOKEN=<token> npm test
```

## Environment variables

| Variable | Default | Meaning |
| --- | --- | --- |
| `E2E_BASE_URL` | `http://localhost:3000` | Target instance |
| `E2E_ACCESS_TOKEN` | *(empty)* | `SITE_ACCESS_TOKEN` for the soft access gate |
| `E2E_SECTION` | `elements` | Section under test (`elements`/`details`/`all`) |
| `E2E_PRACTICE_TIMEOUT_MS` | `120000` | Budget for the explainer practice button |
| `E2E_ABSENCE_GRACE_MS` | `8000` | Wait before asserting an element is absent |
| `E2E_TEST_TOKEN` | *(empty)* | Shared secret; makes the server store the sessions with `is_test_run = true` |
| `E2E_CLEANUP` | `1` | Set to `0` to keep the created sessions instead of deleting them |

## CI

`.github/workflows/e2e-smoke.yml` runs the suite automatically after a
successful **Deploy to Production** run, and on manual dispatch. The HTML
report is uploaded as an artifact when the run fails.

## Test data: marked and cleaned up

Each run creates one real session per combination in the target database, plus
two real LLM practice generations (explainer × 2 languages). Two mechanisms
keep that out of the study data:

1. **Marked** — every browser request carries `E2E_TEST_TOKEN` as the
   `x-e2e-test-token` header. When the server is configured with the same
   secret it stores the session as `is_test_run = true`. Without a matching
   secret on the server nothing is ever marked, and the test fails with a
   pointed message rather than quietly polluting the data.
2. **Cleaned up** — the fixture deletes every session it created after the
   test, pass or fail (`DELETE /api/sessions/:id`, cascades to blocks and chat
   messages). A failed deletion fails the test loudly.

Leftovers from a hard crash stay findable:

```sql
SELECT id, started_at, sigil_mode, lang FROM sessions WHERE is_test_run;
DELETE FROM sessions WHERE is_test_run;   -- cascades to blocks/messages
```

Analyses should exclude them with `WHERE is_test_run = false`.

The server side lives in [`sigil.controller.ts`](../server/src/modules/sigil/sigil.controller.ts)
(`E2E_TEST_TOKEN_HEADER`); the secret is configured as `E2E_TEST_TOKEN` in the
server environment.

## Selectors

The test uses `data-testid` hooks in the client, not visible text:
`inform-block`, `inform-block-material`, `chat-input`,
`inform-block-continue`, `inform-block-preparing-practice`. Keep them in place
when refactoring those components.
