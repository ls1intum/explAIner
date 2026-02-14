import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

/**
 * Submit Answer Request Schema
 *
 * Validates array of selected answer option indices.
 */
const submitAnswerRequestSchema = z.object({
  studentAnswerOptionIndices: z
    .array(z.number().int())
    .min(1, 'At least one answer option must be selected')
    .describe('Array of selected answer option indices (0-based)'),
});

/**
 * Submit Answer Request DTO
 *
 * Request body for submitting practice block answers.
 */
export class SubmitAnswerRequestDto extends createZodDto(
  submitAnswerRequestSchema,
) {}
