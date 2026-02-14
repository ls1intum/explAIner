import { 
  initialBlockSequenceSchema,
  InitialBlockSequence
} from '../schemas/initial-block-sequence.schema';
import { extractJsonFromMarkdown } from '../../../common/utils/json-parser.util';

/**
 * Parser for initial block sequence (block_sequence_counter = 0)
 * Validates: inform block with keyFacts + practice block
 */
export class InitialBlockSequenceParser {
  parse(text: string): InitialBlockSequence {
    try {
      // Extract JSON from markdown code blocks if present
      const jsonText = extractJsonFromMarkdown(text);
      const parsed = JSON.parse(jsonText);

      // Validate using Zod schema
      const validated = initialBlockSequenceSchema.parse(parsed);

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
        throw new Error(`Failed to parse initial block sequence: ${error.message}`);
      }
      throw new Error('Failed to parse initial block sequence: Unknown error');
    }
  }
}
