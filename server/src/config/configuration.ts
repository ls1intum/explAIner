// Maps environment variables to typed configuration object (validated by Joi schema)

export interface AppConfiguration {
  nodeEnv: string;
  port: number;
  clientUrl: string;
  database: {
    url: string;
  };
  anthropic: {
    apiKey: string;
    model: string;
  };
}

export default (): AppConfiguration => ({
  nodeEnv: process.env.NODE_ENV!,
  port: parseInt(process.env.PORT!, 10),
  clientUrl: process.env.CLIENT_URL!,
  database: {
    url: process.env.DATABASE_URL!,
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY!,
    model: process.env.ANTHROPIC_MODEL!,
  },
});
