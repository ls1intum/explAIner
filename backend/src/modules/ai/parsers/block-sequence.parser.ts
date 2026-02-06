import { 
  initialBlockSequenceSchema, 
  subsequentBlockSequenceSchema,
  unifiedBlockSequenceSchema,
  InitialBlockSequence,
  SubsequentBlockSequence,
  UnifiedBlockSequence
} from '../schemas/block-sequence.schema';
import { extractJsonFromMarkdown } from '../../../common/utils/json-parser.util';
import { BlockSequenceMode } from '../../../common/enums/block-sequence-mode.enum';

export class BlockSequenceParser {
  /**
   * Unified parse method that handles both initial and subsequent block sequences
   * Uses mode parameter to determine which schema to validate against
   */
  parse(text: string, mode: BlockSequenceMode): UnifiedBlockSequence {
    try {
      const jsonText = extractJsonFromMarkdown(text);
      const parsed = JSON.parse(jsonText);

      // Validate using unified schema
      const validated = unifiedBlockSequenceSchema.parse(parsed);

      // Validate that the correct field is present based on mode
      if (mode === BlockSequenceMode.INITIAL && !validated.informBlock.keyFacts) {
        throw new Error('Initial mode requires keyFacts in inform block');
      }
      if (mode === BlockSequenceMode.SUBSEQUENT && !validated.informBlock.keyMisconceptions) {
        throw new Error('Subsequent mode requires keyMisconceptions in inform block');
      }

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
        throw new Error(`Failed to parse ${mode} block sequence: ${error.message}`);
      }
      throw new Error(`Failed to parse ${mode} block sequence: Unknown error`);
    }
  }

  /**
   * Parse and validate initial block sequence output from AI using Zod schema
   * Extracts JSON from markdown code blocks if present
   * Returns validated inform block + practice block
   * @deprecated Use parse(text, BlockSequenceMode.INITIAL) instead
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
   * @deprecated Use parse(text, BlockSequenceMode.SUBSEQUENT) instead
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
