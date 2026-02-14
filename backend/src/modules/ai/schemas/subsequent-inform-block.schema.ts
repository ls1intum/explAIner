import { z } from 'zod';

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

// Inferred TypeScript type
export type SubsequentInformBlock = z.infer<typeof subsequentInformBlockSchema>;
