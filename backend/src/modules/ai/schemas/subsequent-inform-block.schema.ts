import { z } from 'zod';

/**
 * Subsequent Inform Block Schema
 * 
 * Used when block_sequence_counter > 0
 * Structure: summary -> keyMisconceptions -> explanation
 */

export const subsequentInformBlockSchema = z.object({
  summary: z.string().min(1, 'Summary must not be empty'),
  keyMisconceptions: z.array(z.string().min(1)).min(1, 'Must have at least 1 key misconception'),
  explanation: z.string().min(1, 'Explanation must not be empty'),
});

// Inferred TypeScript type
export type SubsequentInformBlock = z.infer<typeof subsequentInformBlockSchema>;
