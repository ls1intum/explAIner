import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Submit Feedback Response Schema
const submitFeedbackResponseSchema = z.object({
  success: z.boolean().describe('Whether the feedback was successfully submitted'),
  rating: z.number().describe('The submitted rating (1-5) - 1: "very unhelpful", 5: "very helpful"'),
});

export class SubmitFeedbackResponseDto extends createZodDto(submitFeedbackResponseSchema) {}
