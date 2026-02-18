import { createZodDto } from 'nestjs-zod';
import { submitFeedbackResponseSchema } from '../../../../domain/schemas/sessions/session.schema';

export class SubmitFeedbackResponseDto extends createZodDto(submitFeedbackResponseSchema) {}
