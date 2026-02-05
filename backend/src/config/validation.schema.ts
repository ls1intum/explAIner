// Joi validation schema for environment variables - validates and provides defaults
import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3001),
  FRONTEND_URL: Joi.string().default('http://localhost:3000'),
  DATABASE_URL: Joi.string().required(),
  ANTHROPIC_API_KEY: Joi.string().required(),
  ANTHROPIC_MODEL: Joi.string().default('claude-sonnet-4-5-20250929'),
});
