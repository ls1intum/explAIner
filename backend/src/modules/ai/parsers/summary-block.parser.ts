import { summaryBlockSchema, SummaryBlock } from '../schemas/summary-block.schema';
import { extractJsonFromMarkdown } from '../../../common/utils/json-parser.util';

export class SummaryBlockParser {
  /**
   * Parse and validate summary block output from AI using Zod schema
   * Extracts JSON from markdown code blocks if present
   * Returns validated summary block
   */
  parse(text: string): SummaryBlock {
    try {
      // Extract JSON from markdown code blocks if present
      const jsonText = extractJsonFromMarkdown(text);

      // Parse JSON
      const parsed = JSON.parse(jsonText);

      // Validate using Zod schema - throws ZodError with detailed messages if invalid
      const validated = summaryBlockSchema.parse(parsed);

      return validated;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to parse summary block: ${error.message}`);
      }
      throw new Error('Failed to parse summary block: Unknown error');
    }
  }
}
