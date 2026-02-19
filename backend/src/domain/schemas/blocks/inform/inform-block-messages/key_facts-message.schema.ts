import { z } from 'zod';

/////////////////////////////////////////
// LLM PARSER SCHEMAS
/////////////////////////////////////////

/**
 * Key Facts Message Schema – first message in the initial block-sequence inform block (AI output).
 * Used when parsing block sequence with mode initial.
 */
export const KeyFactsMessageSchema = z.object({
  explanation: z.string().min(1, 'Explanation must not be empty').describe('Detailed explanation of the topic'),
  keyFacts: z
    .array(z.string().min(1))
    .min(2)
    .max(4, 'Must have 2-4 key facts')
    .describe('Key facts for the topic'),
  summary: z.string().min(1, 'Summary must not be empty').describe('Brief summary of the explanation'),
});
export type KeyFactsMessage = z.infer<typeof KeyFactsMessageSchema>;