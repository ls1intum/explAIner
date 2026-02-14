import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { learningGoalSchema } from '../../../ai/schemas/learning-goals.schema';

/**
 * Generate Learning Goals Response Schema
 *
 * API-specific wrapper for learning goals array.
 */
const generateLearningGoalsResponseSchema = z.object({
  learningGoals: z
    .array(learningGoalSchema)
    .describe('Array of generated learning goals'),
});

/**
 * Generate Learning Goals Response DTO
 *
 * Returns an array of learning goals wrapped in an object.
 */
export class GenerateLearningGoalsResponseDto extends createZodDto(generateLearningGoalsResponseSchema) {}
