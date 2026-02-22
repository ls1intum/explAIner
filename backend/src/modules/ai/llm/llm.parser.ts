import { z } from 'zod';
import { extractJsonFromMarkdown } from '../../../common/utils/json-parser.util';

export const MAX_RETRIES = 1;

const RETRY_FIX_MESSAGE = (error: string) =>
  `Your previous response failed validation with this error: ${error}. Please return a valid JSON response matching the required format.`;

/**
 * Generic parser for LLM outputs.
 * Extracts JSON from markdown, parses, and validates using provided Zod schema.
 * Create via LlmService.createParser(schema) to get retry-on-failure; parseWithRetry then uses the bound LLM call automatically.
 */
export class Parser<T> {
  private readonly schemaName: string;

  constructor(
    private readonly schema: z.ZodSchema<T>,
    /** Set by LlmService.createParser; used by parseWithRetry to request a corrected response */
    private readonly llmCall?: (prompt: string) => Promise<string>,
  ) {
    this.schemaName = (this.schema as any)._def?.typeName || 'Unknown';
  }

  /**
   * Parse and validate LLM output (sync). Use parseWithRetry when retry on failure is desired.
   */
  parse(text: string): T {
    try {
      const jsonText = extractJsonFromMarkdown(text);
      const parsed = JSON.parse(jsonText);
      return this.schema.parse(parsed);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to parse LLM output against Schema ${this.schemaName}: ${error.message}`);
      }
      throw new Error(`Failed to parse LLM output against Schema ${this.schemaName}: Unknown error`);
    }
  }

  /**
   * Parse with retry: on failure and if llmCall is set, sends a fix prompt to the LLM and retries (up to MAX_RETRIES).
   */
  async parseWithRetry(text: string, maxRetries = MAX_RETRIES): Promise<T> {
    let lastError = '';
    let currentText = text;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const jsonText = extractJsonFromMarkdown(currentText);
        const parsed = JSON.parse(jsonText);
        return this.schema.parse(parsed);
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Unknown error';
        if (attempt < maxRetries && this.llmCall) {
          currentText = await this.llmCall(RETRY_FIX_MESSAGE(lastError));
        } else {
          break;
        }
      }
    }

    throw new Error(`Failed to parse LLM output after ${maxRetries + 1} attempts: ${lastError}`);
  }
}
