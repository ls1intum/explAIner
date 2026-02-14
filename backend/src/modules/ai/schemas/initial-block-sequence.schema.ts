import { z } from 'zod';
import { initialInformBlockSchema } from './initial-inform-block.schema';
import { practiceBlockSchema } from './practice-block.schema';

/**
 * Initial Block Sequence Schema
 * 
 * Used when block_sequence_counter = 0. Also used to generate DTOs and OpenAPI documentation.
 * Contains:
 * - 1 x Inform Block: explanation, keyFacts, summary
 * - 3 x Practice Block: questions aligned with SOLO taxonomy
 */

export const initialBlockSequenceSchema = z.object({
  informBlock: initialInformBlockSchema.describe('Initial inform block content'),
  practiceBlocks: z
    .array(practiceBlockSchema)
    .length(3, 'Must have exactly 3 practice blocks')
    .describe('Array of 3 practice blocks'),
});

// Re-export types for convenience
export type { InitialInformBlock } from './initial-inform-block.schema';
export type { PracticeBlock } from './practice-block.schema';

// Inferred TypeScript type
export type InitialBlockSequence = z.infer<typeof initialBlockSequenceSchema>;
