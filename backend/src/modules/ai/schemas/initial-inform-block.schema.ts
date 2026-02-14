import { z } from 'zod';

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

// Inferred TypeScript type
export type InitialInformBlock = z.infer<typeof initialInformBlockSchema>;
