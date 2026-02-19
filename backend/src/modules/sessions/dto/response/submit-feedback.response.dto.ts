import { createZodDto } from 'nestjs-zod';
import { SubmitFeedbackResponseSchema } from '../../../../domain/schemas/sessions/session.schema';

/**
 * Response body returned after submitting session feedback.
 */
export class SubmitFeedbackResponseDto extends createZodDto(SubmitFeedbackResponseSchema) {}
