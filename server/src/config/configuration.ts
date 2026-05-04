// Maps environment variables to typed configuration object (validated by Joi schema)

export interface AppConfiguration {
  nodeEnv: string;
  port: number;
  clientUrl: string;
  database: {
    url: string;
  };
  llm: {
    apiKey: string;
    baseUrl: string;
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
  llm: {
    apiKey: process.env.LLM_API_KEY!,
    baseUrl: process.env.LLM_BASE_URL!,
    model: process.env.LLM_MODEL!,
  },
});
