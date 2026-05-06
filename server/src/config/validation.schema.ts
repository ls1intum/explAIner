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
  LLM_BASE_URL: Joi.string().default('https://chat-ai.academiccloud.de/v1'),
  LLM_MODEL: Joi.string().default('llama-3.3-70b-instruct'),
  ALLOWED_ORIGINS: Joi.string().optional(),
});
