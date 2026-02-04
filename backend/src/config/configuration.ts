export default () => ({
  port: parseInt(process.env.PORT!, 10),
  database: {
    url: process.env.DATABASE_URL,
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5-20250929',
    // model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
  },
});
