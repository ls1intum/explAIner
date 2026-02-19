import { createZodDto } from 'nestjs-zod';
import { SubmitFeedbackRequestSchema } from '../../../../domain/schemas/sessions/session.schema';

/**
 * Request body for submitting session feedback.
 */
export class SubmitFeedbackRequestDto extends createZodDto(SubmitFeedbackRequestSchema) {}
