import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { informBlockMessageSchema } from '../../../../domain/schemas/blocks/inform-block.schema';

/**
 * Generate Chat Response Request Schema
 *
 * Validates user message for inform block chat.
 */
const generateChatResponseRequestSchema = z.object({
  message: informBlockMessageSchema.shape.message
    .describe('User message / follow-up question sent in the inform block chat'),
});

/**
 * Generate Chat Response Request DTO
 *
 * Request body for sending chat messages to inform blocks.
 */
export class GenerateChatResponseRequestDto extends createZodDto(
  generateChatResponseRequestSchema,
) {}
