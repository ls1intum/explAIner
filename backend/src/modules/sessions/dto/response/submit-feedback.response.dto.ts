import { createZodDto } from 'nestjs-zod';
import { submitFeedbackResponseSchema } from '../../../../domain/schemas/sessions/session.schema';

/**
 * Response body returned after submitting session feedback.
 */
export class SubmitFeedbackResponseDto extends createZodDto(submitFeedbackResponseSchema) {}
