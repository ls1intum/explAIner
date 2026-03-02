import { createZodDto } from 'nestjs-zod';
import { SubmitFeedbackRequestDtoSchema } from '../../../../domain/schemas/dto/session.schema';

/**
 * Request body for submitting session feedback
 */
export class SubmitFeedbackRequestDto extends createZodDto(SubmitFeedbackRequestDtoSchema) {}
