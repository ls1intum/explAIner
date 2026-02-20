import { createZodDto } from 'nestjs-zod';
import { SubmitAnswerRequestDtoSchema } from '../../../../domain/schemas/dto/blocks.schema';

/**
 * Request body for submitting practice block answers.
 */
export class SubmitAnswerRequestDto extends createZodDto(SubmitAnswerRequestDtoSchema) {}
