import { createZodDto } from 'nestjs-zod';
import { generateLearningGoalsResponseSchema } from '../../../../domain/schemas/learning-goals/learning-goals.schema';

/**
 * Response body returning the generated learning goals array.
 */
export class GenerateLearningGoalsResponseDto extends createZodDto(
  generateLearningGoalsResponseSchema,
) {}
