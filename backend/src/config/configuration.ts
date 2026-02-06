// Maps environment variables to typed configuration object (validated by Joi schema)
import { AppConfiguration } from './configuration.interface';

export default (): AppConfiguration => ({
  nodeEnv: process.env.NODE_ENV!,
  port: parseInt(process.env.PORT!, 10),
  frontendUrl: process.env.FRONTEND_URL!,
  database: {
    url: process.env.DATABASE_URL!,
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY!,
    model: process.env.ANTHROPIC_MODEL!,
  },
});
