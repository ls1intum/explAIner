import { 
  initialBlockSequenceSchema, 
  subsequentBlockSequenceSchema,
  InitialBlockSequence,
  SubsequentBlockSequence 
} from '../schemas/block-sequence.schema';
import { extractJsonFromMarkdown } from '../../../common/utils/json-parser.util';

export class BlockSequenceParser {
  /**
   * Parse and validate initial block sequence output from AI using Zod schema
   * Extracts JSON from markdown code blocks if present
   * Returns validated inform block + practice block
   */
  parseInitial(text: string): InitialBlockSequence {
    try {
      // Extract JSON from markdown code blocks if present
      const jsonText = extractJsonFromMarkdown(text);

      // Parse JSON
      const parsed = JSON.parse(jsonText);

      // Validate using Zod schema - throws ZodError with detailed messages if invalid
      const validated = initialBlockSequenceSchema.parse(parsed);

      // Optional: Warn if no questions have multiple correct answers
      const hasMultipleCorrect = validated.practiceBlock.questions.some(
        (q) => q.correctAnswerOptionIndices.length > 1
      );

      if (!hasMultipleCorrect) {
        console.warn('Warning: None of the practice questions have multiple correct answers');
      }

      return validated;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to parse initial block sequence: ${error.message}`);
      }
      throw new Error('Failed to parse initial block sequence: Unknown error');
    }
  }

  /**
   * Parse and validate subsequent block sequence output from AI using Zod schema
   * Extracts JSON from markdown code blocks if present
   * Returns validated inform block + practice block
   */
  parseSubsequent(text: string): SubsequentBlockSequence {
    try {
      // Extract JSON from markdown code blocks if present
      const jsonText = extractJsonFromMarkdown(text);

      // Parse JSON
      const parsed = JSON.parse(jsonText);

      // Validate using Zod schema - throws ZodError with detailed messages if invalid
      const validated = subsequentBlockSequenceSchema.parse(parsed);

      // Optional: Warn if no questions have multiple correct answers
      const hasMultipleCorrect = validated.practiceBlock.questions.some(
        (q) => q.correctAnswerOptionIndices.length > 1
      );

      if (!hasMultipleCorrect) {
        console.warn('Warning: None of the practice questions have multiple correct answers');
      }

      return validated;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to parse subsequent block sequence: ${error.message}`);
      }
      throw new Error('Failed to parse subsequent block sequence: Unknown error');
    }
  }
}
