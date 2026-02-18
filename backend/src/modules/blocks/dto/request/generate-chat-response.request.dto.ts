import { createZodDto } from 'nestjs-zod';
import { followUpQuestionMessageSchema } from '../../../../domain/schemas/blocks/inform/inform-block-messages/follow_up_question-message.schema';

/**
 * Request body for sending chat messages to inform blocks.
 */
export class GenerateChatResponseRequestDto extends createZodDto(followUpQuestionMessageSchema) {}
