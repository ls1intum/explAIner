import { createZodDto } from 'nestjs-zod';
import { submitAnswerResponseSchema } from '../../../../domain/schemas/blocks/practice/practice-block.schema';

export class SubmitAnswerResponseDto extends createZodDto(submitAnswerResponseSchema) {}
