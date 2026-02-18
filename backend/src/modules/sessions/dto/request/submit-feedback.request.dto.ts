import { createZodDto } from 'nestjs-zod';
import { submitFeedbackRequestSchema } from '../../../../domain/schemas/sessions/session.schema';

/**
 * Request body for submitting session feedback.
 */
export class SubmitFeedbackRequestDto extends createZodDto(submitFeedbackRequestSchema) {}
