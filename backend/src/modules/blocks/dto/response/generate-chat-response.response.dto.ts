import { createZodDto } from 'nestjs-zod';
import { followUpAnswerMessageSchema } from '../../../../domain/schemas/blocks/inform/inform-block-messages/follow_up_answer-message.schema';

/** Response when students ask follow-up questions in inform blocks. */
export class GenerateChatResponseResponseDto extends createZodDto(followUpAnswerMessageSchema) {}
