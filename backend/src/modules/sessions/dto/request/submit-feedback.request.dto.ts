import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

/**
 * Submit Feedback Request Schema
 *
 * Validates user rating (1-5 stars).
 */
const submitFeedbackRequestSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5')
    .describe('User rating for the session (1-5 stars) - 1: "very unhelpful", 5: "very helpful"'),
});

/**
 * Submit Feedback Request DTO
 *
 * Request body for submitting session feedback.
 */
export class SubmitFeedbackRequestDto extends createZodDto(
  submitFeedbackRequestSchema,
) {}
