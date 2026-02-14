import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

/**
 * Generate Easier Learning Goals Request Schema
 *
 * Validates session ID for generating easier learning goals.
 */
const generateEasierLearningGoalsRequestSchema = z.object({
  sessionId: z
    .string()
    .min(1, 'Session ID cannot be empty')
    .describe('Session ID of the existing session to generate easier learning goals for'),
});

/**
 * Generate Easier Learning Goals Request DTO
 *
 * Request body for generating easier learning goals based on previous session.
 */
export class GenerateEasierLearningGoalsRequestDto extends createZodDto(
  generateEasierLearningGoalsRequestSchema,
) {}
