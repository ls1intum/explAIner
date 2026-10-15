import { createServer, type Server } from 'http';
import type { AddressInfo } from 'net';
import type { ConfigService } from '@nestjs/config';
import { LlmService } from './llm.service';

/**
 * Runs the real OpenAI SDK against a local mock endpoint, so request options
 * the SDK rejects (e.g. an explicit `timeout: undefined`) fail here and not in
 * production.
 */
describe('LlmService', () => {
  let server: Server;
  let service: LlmService;

  beforeAll(async () => {
    server = createServer((_req, res) => {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(
        JSON.stringify({
          id: 'c1',
          object: 'chat.completion',
          created: 0,
          model: 'test-model',
          choices: [{ index: 0, finish_reason: 'stop', message: { role: 'assistant', content: 'answer' } }],
          usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
        }),
      );
    });
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    const { port } = server.address() as AddressInfo;
    const config: Record<string, string> = {
      'llm.apiKey': 'test-key',
      'llm.baseUrl': `http://127.0.0.1:${port}/v1`,
      'llm.model': 'test-model',
    };
    service = new LlmService({ get: (key: string) => config[key] } as unknown as ConfigService);
  });

  afterAll(() => new Promise<void>((resolve) => server.close(() => resolve())));

  it('calls the LLM with the default timeout and retries', async () => {
    await expect(service.callClaude('prompt')).resolves.toBe('answer');
  });

  it('calls the LLM with per-call overrides', async () => {
    await expect(service.callClaude('prompt', 'label', { timeoutMs: 60_000, maxRetries: 0 })).resolves.toBe('answer');
  });

  it('calls the LLM when only one override is set', async () => {
    await expect(service.callClaude('prompt', 'label', { maxRetries: 0 })).resolves.toBe('answer');
  });
});
