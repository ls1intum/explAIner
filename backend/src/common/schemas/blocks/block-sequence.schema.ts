import { z } from 'zod';
import { informBlockSchema } from './inform-block.schema';
import { practiceBlockSchema } from './practice-block.schema';

/**
 * Block Sequence Schema
 *
 * Defines a complete learning sequence: 1 inform block + 3 practice blocks.
 */
export const blockSequenceSchema = z.object({
  informBlock: informBlockSchema.describe('Inform block introducing new content'),
  practiceBlocks: z.tuple([
    practiceBlockSchema,
    practiceBlockSchema,
    practiceBlockSchema,
  ]).describe('Exactly 3 practice blocks for reinforcement'),
});

// Inferred TypeScript type
export type BlockSequence = z.infer<typeof blockSequenceSchema>;
