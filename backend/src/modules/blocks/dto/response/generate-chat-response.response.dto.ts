import { createZodDto } from 'nestjs-zod';
import { FollowUpAnswerMessageDtoSchema } from '../../../../domain/schemas/dto/blocks.schema';

/**
 * Response body returning the LLM response to a follow-up question in an inform block.
 */
export class GenerateChatResponseResponseDto extends createZodDto(FollowUpAnswerMessageDtoSchema) {}
