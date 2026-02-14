import { z } from 'zod';
import { subsequentInformBlockSchema } from './subsequent-inform-block.schema';
import { practiceBlockSchema } from './practice-block.schema';

/**
 * Subsequent Block Sequence Schema
 * 
 * Used when block_sequence_counter > 0
 * Contains:
 * - Inform Block: summary, keyMisconceptions, explanation
 * - Practice Block: 3 questions aligned with SOLO taxonomy
 */

export const subsequentBlockSequenceSchema = z.object({
  informBlock: subsequentInformBlockSchema,
  practiceBlock: practiceBlockSchema,
});

// Re-export types for convenience
export type { SubsequentInformBlock } from './subsequent-inform-block.schema';
export type { PracticeQuestion, PracticeBlock } from './practice-block.schema';

// Inferred TypeScript type
export type SubsequentBlockSequence = z.infer<typeof subsequentBlockSequenceSchema>;
