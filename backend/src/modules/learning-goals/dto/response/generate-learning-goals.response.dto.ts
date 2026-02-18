import { createZodDto } from 'nestjs-zod';
import { generateLearningGoalsResponseSchema } from '../../../../domain/schemas/learning-goals/learning-goals.schema';

/**
 * Returns an array of learning goals wrapped in an object.
 */
export class GenerateLearningGoalsResponseDto extends createZodDto(
  generateLearningGoalsResponseSchema,
) {}
