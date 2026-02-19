import { createZodDto } from 'nestjs-zod';
import { SubmitAnswerResponseSchema } from '../../../../domain/schemas/blocks/practice/practice-block.schema';

/**
 * Response body returning the result of a submitted practice block answer.
 */
export class SubmitAnswerResponseDto extends createZodDto(SubmitAnswerResponseSchema) {}
