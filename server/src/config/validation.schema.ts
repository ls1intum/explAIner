/**
 * Joi schema for environment variables. Used by Nest ConfigModule at app startup:
 * validates required vars (e.g. DATABASE_URL), applies defaults for optional ones,
 * and fails with error message if env is invalid or missing required keys.
 */
import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3001),
  CLIENT_URL: Joi.string().default('http://localhost:3000'),
  DATABASE_URL: Joi.string().required(),
  LLM_API_KEY: Joi.string().required(),
  LLM_BASE_URL: Joi.string().default('https://logos.aet.cit.tum.de/v1'),
  LLM_MODEL: Joi.string().default('openai/gpt-oss-120b'),
  ALLOWED_ORIGINS: Joi.string().optional(),
  // Shared secret used by the e2e smoke test to flag its sessions as test data.
  // Unset = the marker can never be set (normal for local dev).
  E2E_TEST_TOKEN: Joi.string().optional(),
});
