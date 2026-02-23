import { z } from 'zod';
import { extractJsonFromMarkdown } from '../shared.utils';

// Maximum number of retries if LLM output does not match the schema
export const MAX_RETRIES = 1;

// Message added to LLM prompt if parse fails
const RETRY_FIX_MESSAGE = (error: string) =>
  `Your previous response failed validation with this error: ${error}. Please return a valid JSON response matching the required format.`;

/** Generic parser for LLM output */
export class Parser<T> {
  constructor(
    private readonly schema: z.ZodSchema<T>, // Schema to validate against
    private readonly llmCall?: (prompt: string) => Promise<string>, // LLM call function to request a fix if parse fails
  ) {}

  /** Parse LLM output against schema */
  async parse(llmResponse: string, maxRetries = MAX_RETRIES): Promise<T> {
    let lastError = '';
    let textToParse = llmResponse;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Extract JSON object (remove markdown if present)
        const jsonText = extractJsonFromMarkdown(textToParse);
        const jsonObject = JSON.parse(jsonText);
        // Validate against schema
        return this.schema.parse(jsonObject);
      } catch (error) {
        // Store error message
        lastError = error instanceof Error ? error.message : 'Unknown error';
        if (attempt < maxRetries && this.llmCall) {
          // Request a fix from the LLM
          const prompt_with_fix_request = RETRY_FIX_MESSAGE(lastError);
          textToParse = await this.llmCall(prompt_with_fix_request); 
        } else {
          break;
        }
      }
    }
    throw new Error(`Failed to parse LLM output after ${maxRetries + 1} attempts: ${lastError}`);
  }
}
