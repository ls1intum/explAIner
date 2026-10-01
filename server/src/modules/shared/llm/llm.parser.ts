import { z } from 'zod';
import { extractJsonFromMarkdown } from '../shared.utils';

// Maximum number of retries if LLM output does not match the schema
export const MAX_RETRIES = 1;

// Message sent to the LLM if parse fails. It carries the previous response so
// the model can repair it (the retry call has no other conversation context).
const RETRY_FIX_MESSAGE = (previousResponse: string, error: string) =>
  `Your previous response failed validation with this error: ${error}

Your previous response was:
${previousResponse}

Return the corrected response as a pure JSON object matching the required format. Do NOT wrap it in markdown code blocks and do NOT add any explanation.`;

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
          const prompt_with_fix_request = RETRY_FIX_MESSAGE(textToParse, lastError);
          textToParse = await this.llmCall(prompt_with_fix_request); 
        } else {
          break;
        }
      }
    }
    throw new Error(`Failed to parse LLM output after ${maxRetries + 1} attempts: ${lastError}`);
  }
}
