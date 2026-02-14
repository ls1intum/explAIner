import { z } from 'zod';
import { initialInformBlockSchema } from './initial-inform-block.schema';
import { practiceBlockSchema } from './practice-block.schema';

/**
 * Initial Block Sequence Schema
 * 
 * Used when block_sequence_counter = 0
 * Contains:
 * - Inform Block: explanation, keyFacts, summary
 * - Practice Block: 3 questions aligned with SOLO taxonomy
 */

export const initialBlockSequenceSchema = z.object({
  informBlock: initialInformBlockSchema,
  practiceBlock: practiceBlockSchema,
});

// Re-export types for convenience
export type { InitialInformBlock } from './initial-inform-block.schema';
export type { PracticeQuestion, PracticeBlock } from './practice-block.schema';

// Inferred TypeScript type
export type InitialBlockSequence = z.infer<typeof initialBlockSequenceSchema>;
