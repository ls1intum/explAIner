import { createZodDto } from 'nestjs-zod';
import { FollowUpQuestionMessageDtoSchema } from '../../../../domain/schemas/dto/blocks.schema';

/**
 * Request body for sending chat messages to inform blocks
 */
export class GenerateChatResponseRequestDto extends createZodDto(FollowUpQuestionMessageDtoSchema) {}
