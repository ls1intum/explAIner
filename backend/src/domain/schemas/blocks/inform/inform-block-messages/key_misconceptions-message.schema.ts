import { z } from 'zod';

/////////////////////////////////////////
// LLM PARSER SCHEMAS
/////////////////////////////////////////

/**
 * Key Misconceptions Message Schema – subsequent block-sequence inform block (AI output).
 * Used when parsing block sequence with mode subsequent.
 */
export const keyMisconceptionsMessageSchema = z.object({
  explanation: z.string().min(1, 'Explanation must not be empty').describe('Explanation addressing misconceptions'),
  keyMisconceptions: z
    .array(z.string().min(1))
    .min(2)
    .max(4, 'Must have 2-4 key misconceptions')
    .describe('Key misconceptions to address'),
  summary: z.string().min(1, 'Summary must not be empty').describe('Brief summary of the explanation'),
});

export type KeyMisconceptionsMessage = z.infer<typeof keyMisconceptionsMessageSchema>;
