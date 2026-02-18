import { z } from 'zod';
import { informBlockMessageSchema } from '../../../domain/schemas/blocks/inform-block.schema';

/**
 * Chat Response Schema
 * 
 * This schema defines the structured response for chat messages within
 * an Inform Block. Used when students ask follow-up questions.
 * Also used to generate DTOs and OpenAPI documentation.
 * 
 * The response is stored in the inform_block_messages table with sender='Owlbert'.
 */
export const chatResponseSchema = z.object({
  response: informBlockMessageSchema.shape.message
    .describe('AI response from Owlbert'),
});

// Inferred TypeScript type
export type ChatResponse = z.infer<typeof chatResponseSchema>;
