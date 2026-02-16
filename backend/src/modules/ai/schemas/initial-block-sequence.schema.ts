import { z } from 'zod';
import { practiceBlockSchema } from './practice-block.schema';

/**
 * Initial Inform Block Schema
 * 
 * Used when block_sequence_counter = 0. Also used to generate DTOs and OpenAPI documentation.
 * Structure: explanation -> keyFacts -> summary
 */
export const initialInformBlockSchema = z.object({
  explanation: z
    .string()
    .min(1, 'Explanation must not be empty')
    .describe('Detailed explanation of the topic'),
  keyFacts: z
    .array(z.string().min(1))
    .min(2)
    .max(4, 'Must have 2-4 key facts')
    .describe('Key facts (2-4 items)'),
  summary: z
    .string()
    .min(1, 'Summary must not be empty')
    .describe('Brief summary of the explanation'),
});

export type InitialInformBlock = z.infer<typeof initialInformBlockSchema>;

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
export type { PracticeBlock } from './practice-block.schema';

export type InitialBlockSequence = z.infer<typeof initialBlockSequenceSchema>;
