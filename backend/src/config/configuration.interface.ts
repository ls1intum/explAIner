export interface AppConfiguration {
  nodeEnv: string;
  port: number;
  frontendUrl: string;
  database: {
    url: string;
  };
  anthropic: {
    apiKey: string;
    model: string;
  };
}
