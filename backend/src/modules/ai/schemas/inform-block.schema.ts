import { z } from 'zod';

/**
 * Inform Block Schemas
 * 
 * Initial Inform Block (block_sequence_counter = 0):
 * - explanation, keyFacts, summary
 * 
 * Subsequent Inform Block (block_sequence_counter > 0):
 * - summary, keyMisconceptions, explanation
 */

// Initial inform block (explanation -> keyFacts -> summary)
export const initialInformBlockSchema = z.object({
  explanation: z.string().min(1, 'Explanation must not be empty'),
  keyFacts: z.array(z.string().min(1)).min(2).max(4, 'Must have 2-4 key facts'),
  summary: z.string().min(1, 'Summary must not be empty'),
});

// Subsequent inform block (keyMisconceptions)
export const subsequentInformBlockSchema = z.object({
  summary: z.string().min(1, 'Summary must not be empty'),
  keyMisconceptions: z.array(z.string().min(1)).min(1, 'Must have at least 1 key misconception'),
  explanation: z.string().min(1, 'Explanation must not be empty'),
});

// Unified inform block (accepts either keyFacts OR keyMisconceptions)
export const unifiedInformBlockSchema = z.object({
  explanation: z.string().min(1, 'Explanation must not be empty'),
  summary: z.string().min(1, 'Summary must not be empty'),
  keyFacts: z.array(z.string().min(1)).min(2).max(4).optional(),
  keyMisconceptions: z.array(z.string().min(1)).min(2).max(4).optional(),
}).refine(
  (data) => (data.keyFacts && !data.keyMisconceptions) || (!data.keyFacts && data.keyMisconceptions),
  { message: 'Must have either keyFacts or keyMisconceptions, but not both' }
);

// Inferred TypeScript types
export type InitialInformBlock = z.infer<typeof initialInformBlockSchema>;
export type SubsequentInformBlock = z.infer<typeof subsequentInformBlockSchema>;
export type UnifiedInformBlock = z.infer<typeof unifiedInformBlockSchema>;
