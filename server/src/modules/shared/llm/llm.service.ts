import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI, { APIConnectionError, APIError } from 'openai';
import { z } from 'zod';
import { Parser } from './llm.parser';

// Per-request timeout and SDK-level retries (on timeouts/5xx) for LLM calls
const LLM_TIMEOUT_MS = 90_000;
const LLM_MAX_RETRIES = 1;

/**
 * The LLM endpoint (logos) did not answer: timeout, connection error or 5xx.
 * Extends ServiceUnavailableException so synchronous endpoints answer with
 * HTTP 503 and the client can show a "logos not reachable" message.
 */
export class LlmUnavailableError extends ServiceUnavailableException {
  constructor(detail: string) {
    super(`LLM service not reachable: ${detail}`);
  }
}

function isLlmUnavailable(error: unknown): boolean {
  // APIConnectionTimeoutError extends APIConnectionError
  if (error instanceof APIConnectionError) return true;
  return error instanceof APIError && (error.status ?? 0) >= 500;
}

@Injectable()
export class LlmService {
  private client: OpenAI;
  private readonly model: string;
  private readonly logger = new Logger('LLM');
  private callCounter = 0;

  /** Parser with retry wired to this service; pass only the schema (label tags retry calls in the log). */
  createParser<T>(schema: z.ZodSchema<T>, label = 'llm'): Parser<T> {
    return new Parser(schema, (p) => this.callClaude(p, `${label} (retry)`));
  }

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('llm.apiKey');
    const baseURL = this.configService.get<string>('llm.baseUrl');
    this.model = this.configService.get<string>('llm.model')!;
    // Without an explicit timeout the SDK defaults (10 min, 2 retries) let a
    // hanging LLM endpoint block a call for ~30 min (logos outage 2026-09-24).
    this.client = new OpenAI({ apiKey, baseURL, timeout: LLM_TIMEOUT_MS, maxRetries: LLM_MAX_RETRIES });
  }

  /**
   * Call LLM with a prompt and return raw text response.
   *
   * Logs a start and an end/failure line per call with the elapsed time, so a
   * hanging call shows up as a `#id start` without a matching `#id done`.
   */
  async callClaude(prompt: string, label = 'llm'): Promise<string> {
    const callId = ++this.callCounter;
    const startedAt = Date.now();
    this.logger.log(`#${callId} ${label} start (model=${this.model.trim()}, promptChars=${prompt.length})`);

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      });

      const choice = response.choices[0];
      const usage = response.usage;
      this.logger.log(
        `#${callId} ${label} done in ${Date.now() - startedAt}ms ` +
          `(finish=${choice?.finish_reason ?? '-'}, promptTokens=${usage?.prompt_tokens ?? '-'}, ` +
          `completionTokens=${usage?.completion_tokens ?? '-'})`,
      );

      const content = choice?.message?.content;
      if (!content) {
        throw new Error('No text content in LLM response');
      }

      return content;
    } catch (error) {
      this.logger.error(`#${callId} ${label} failed after ${Date.now() - startedAt}ms: ${error.message}`);
      if (isLlmUnavailable(error)) {
        throw new LlmUnavailableError(error.message);
      }
      throw new Error(`Failed to call LLM: ${error.message}`);
    }
  }
}
