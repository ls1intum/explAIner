import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { learningGoalsSchema } from '../../../../common/schemas/learning-goals/learning-goals.schema';

/**
 * Generate Learning Goals Response Schema
 *
 * API-specific wrapper for learning goals array (exactly 3 goals).
 */
const generateLearningGoalsResponseSchema = z.object({
  learningGoals: learningGoalsSchema.describe('Array of exactly 3 generated learning goals'),
});

/**
 * Generate Learning Goals Response DTO
 *
 * Returns an array of learning goals wrapped in an object.
 */
export class GenerateLearningGoalsResponseDto extends createZodDto(generateLearningGoalsResponseSchema) {}
