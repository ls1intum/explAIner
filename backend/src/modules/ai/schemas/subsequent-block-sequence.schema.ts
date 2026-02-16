import { z } from 'zod';
import { practiceBlockSchema } from './practice-block.schema';

/**
 * Subsequent Inform Block Schema
 * 
 * Used when block_sequence_counter > 0. Also used to generate DTOs and OpenAPI documentation.
 * Structure: summary -> keyMisconceptions -> explanation
 */
export const subsequentInformBlockSchema = z.object({
  summary: z
    .string()
    .min(1, 'Summary must not be empty')
    .describe('Summary of previous learning'),
  keyMisconceptions: z
    .array(z.string().min(1))
    .min(1, 'Must have at least 1 key misconception')
    .describe('Key misconceptions to address (at least 1)'),
  explanation: z
    .string()
    .min(1, 'Explanation must not be empty')
    .describe('Detailed explanation addressing misconceptions'),
});

export type SubsequentInformBlock = z.infer<typeof subsequentInformBlockSchema>;

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
export type { PracticeBlock } from './practice-block.schema';

export type SubsequentBlockSequence = z.infer<typeof subsequentBlockSequenceSchema>;
