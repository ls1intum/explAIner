import { createZodDto } from 'nestjs-zod';
import { SubmitAnswerResponseDtoSchema } from '../../../../domain/schemas/dto/blocks.schema';

/**
 * Response body returning the result of a submitted practice block answer.
 */
export class SubmitAnswerResponseDto extends createZodDto(SubmitAnswerResponseDtoSchema) {}
