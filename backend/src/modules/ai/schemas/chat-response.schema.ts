import { z } from 'zod';

/**
 * Chat Response Schema
 * 
 * This schema defines the structured response for chat messages within
 * an Inform Block. Used when students ask follow-up questions.
 * 
 * The response is stored in the inform_block_messages table with sender='Owlbert'.
 */
export const chatResponseSchema = z.object({
  response: z.string().min(1, 'Response must not be empty'),
});

// Inferred TypeScript type
export type ChatResponse = z.infer<typeof chatResponseSchema>;
