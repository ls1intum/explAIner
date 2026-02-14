import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Submit Answer Response Schema (API response)
const submitAnswerResponseSchema = z.object({
  success: z.boolean().describe('Whether the student answer was successfully persisted'),
  studentAnswerOptionIndices: z
    .array(z.number())
    .describe('Array of selected answer option indices (0-based)')
    .meta({ example: [0, 2] }),
});

export class SubmitAnswerResponseDto extends createZodDto(submitAnswerResponseSchema) {}
