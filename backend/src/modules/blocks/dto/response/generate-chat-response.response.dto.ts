import { createZodDto } from 'nestjs-zod';
import { chatResponseSchema } from '../../../ai/schemas/chat-response.schema';

/**
 * Generate Chat Response DTO
 *
 * Generated from Zod schema - used for both LLM validation and API responses.
 */
export class GenerateChatResponseResponseDto extends createZodDto(chatResponseSchema) {}
