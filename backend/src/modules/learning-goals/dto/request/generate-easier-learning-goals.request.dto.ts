import { createZodDto } from 'nestjs-zod';
import { GenerateEasierLearningGoalsRequestSchema } from '../../../../domain/schemas/learning-goals/learning-goals.schema';

/**
 * Request body for generating easier learning goals based on previous session.
 */
export class GenerateEasierLearningGoalsRequestDto extends createZodDto(
  GenerateEasierLearningGoalsRequestSchema,
) {}
