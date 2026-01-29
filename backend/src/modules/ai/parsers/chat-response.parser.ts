import { chatResponseSchema, ChatResponse } from '../schemas/chat-response.schema';
import { extractJsonFromMarkdown } from '../../../common/utils/json-parser.util';

export class ChatResponseParser {
  /**
   * Parse and validate chat response output from AI using Zod schema
   * Extracts JSON from markdown code blocks if present
   * Returns validated chat response
   */
  parse(text: string): ChatResponse {
    try {
      // Extract JSON from markdown code blocks if present
      const jsonText = extractJsonFromMarkdown(text);

      // Parse JSON
      const parsed = JSON.parse(jsonText);

      // Validate using Zod schema - throws ZodError with detailed messages if invalid
      const validated = chatResponseSchema.parse(parsed);

      return validated;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to parse chat response: ${error.message}`);
      }
      throw new Error('Failed to parse chat response: Unknown error');
    }
  }
}
