import { z } from 'zod';
import { subsequentInformBlockSchema } from './subsequent-inform-block.schema';
import { practiceBlockSchema } from './practice-block.schema';

/**
 * Subsequent Block Sequence Schema
 * 
 * Used when block_sequence_counter > 0. Also used to generate DTOs and OpenAPI documentation.
 * Contains:
 * - 1 x Inform Block: summary, keyMisconceptions, explanation
 * - 3 x Practice Block: questions aligned with SOLO taxonomy
 */

export const subsequentBlockSequenceSchema = z.object({
  informBlock: subsequentInformBlockSchema.describe('Subsequent inform block content'),
  practiceBlocks: z
    .array(practiceBlockSchema)
    .length(3, 'Must have exactly 3 practice blocks')
    .describe('Array of 3 practice blocks'),
});

// Re-export types for convenience
export type { SubsequentInformBlock } from './subsequent-inform-block.schema';
export type { PracticeBlock } from './practice-block.schema';

// Inferred TypeScript type
export type SubsequentBlockSequence = z.infer<typeof subsequentBlockSequenceSchema>;
