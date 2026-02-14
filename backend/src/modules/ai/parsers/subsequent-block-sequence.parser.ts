import { 
  subsequentBlockSequenceSchema,
  SubsequentBlockSequence
} from '../schemas/subsequent-block-sequence.schema';
import { extractJsonFromMarkdown } from '../../../common/utils/json-parser.util';

/**
 * Parser for subsequent block sequence (block_sequence_counter > 0)
 * Validates: inform block with keyMisconceptions + practice block
 */
export class SubsequentBlockSequenceParser {
  parse(text: string): SubsequentBlockSequence {
    try {
      // Extract JSON from markdown code blocks if present
      const jsonText = extractJsonFromMarkdown(text);
      const parsed = JSON.parse(jsonText);

      // Validate using Zod schema
      const validated = subsequentBlockSequenceSchema.parse(parsed);

      // Warn if no questions have multiple correct answers
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
