import { createZodDto } from 'nestjs-zod';
import { SubmitFeedbackResponseDtoSchema } from '../../../../domain/schemas/dto/session.schema';

/**
 * Response body returned after submitting session feedback
 */
export class SubmitFeedbackResponseDto extends createZodDto(SubmitFeedbackResponseDtoSchema) {}
