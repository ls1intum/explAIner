import { z } from 'zod';
import { extractJsonFromMarkdown } from '../../../common/utils/json-parser.util';

const RETRY_FIX_MESSAGE = (error: string) =>
  `Your previous response failed validation with this error: ${error}. Please return a valid JSON response matching the required format.`;

/**
 * Generic parser for LLM outputs.
 * Extracts JSON from markdown, parses, and validates using provided Zod schema.
 * Optional llmCall enables parseWithRetry: on validation failure, the LLM is re-called with a fix prompt.
 */
export class Parser<T> {
  private readonly schemaName: string;

  constructor(
    private readonly schema: z.ZodSchema<T>,
    /** When provided, parseWithRetry uses this to request a corrected response from the LLM on parse failure */
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
   * Parse with retry: on failure and if llmCall is set, sends a fix prompt to the LLM and retries with the new output.
   * @param text Initial LLM output (or transformed text)
   * @param maxRetries Number of retry attempts (default 1)
   */
  async parseWithRetry(text: string, maxRetries = 1): Promise<T> {
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
