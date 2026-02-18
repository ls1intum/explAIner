import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { informBlockMessageSchema } from '../../../../common/schemas/blocks/inform-block.schema';

/**
 * Chat Response Schema
 *
 * Defines the response structure for chat messages within an Inform Block.
 */
const chatResponseSchema = z.object({
  response: informBlockMessageSchema.shape.message
    .describe('AI response from Owlbert'),
});

/**
 * Generate Chat Response DTO
 *
 * Used for API responses when students ask follow-up questions in inform blocks.
 */
export class GenerateChatResponseResponseDto extends createZodDto(chatResponseSchema) {}
