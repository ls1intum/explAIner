import { createZodDto } from 'nestjs-zod';
import { FollowUpAnswerMessageSchema } from '../../../../domain/schemas/blocks/inform/inform-block-messages/follow_up_answer-message.schema';

/**
 * Response body returning the LLM response to a follow-up question in an inform block.
 */
export class GenerateChatResponseResponseDto extends createZodDto(FollowUpAnswerMessageSchema) {}
