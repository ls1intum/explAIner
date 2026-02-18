import { createZodDto } from 'nestjs-zod';
import { submitAnswerRequestSchema } from '../../../../domain/schemas/blocks/practice/practice-block.schema';

/**
 * Request body for submitting practice block answers.
 */
export class SubmitAnswerRequestDto extends createZodDto(submitAnswerRequestSchema) {}
