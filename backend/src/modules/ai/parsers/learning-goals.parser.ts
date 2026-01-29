import { learningGoalsArraySchema, LearningGoalsArray } from '../schemas/learning-goals.schema';
import { extractJsonFromMarkdown } from '../../../common/utils/json-parser.util';

export class LearningGoalsParser {
  /**
   * Parse and validate learning goals output from AI using Zod schema
   * Extracts JSON from markdown code blocks if present
   * Returns validated array of 3 learning goals
   */
  parse(text: string): LearningGoalsArray {
    try {
      // Extract JSON from markdown code blocks if present
      const jsonText = extractJsonFromMarkdown(text);

      // Parse JSON
      const parsed = JSON.parse(jsonText);

      // Validate using Zod schema - throws ZodError with detailed messages if invalid
      const validated = learningGoalsArraySchema.parse(parsed);

      return validated;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to parse learning goals: ${error.message}`);
      }
      throw new Error('Failed to parse learning goals: Unknown error');
    }
  }
}
