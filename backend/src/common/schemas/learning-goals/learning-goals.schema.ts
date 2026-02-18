import { z } from 'zod';
import { learningGoalSchema } from './learning-goal.schema';

/**
 * Learning Goals Schema
 *
 * Validates exactly 3 learning goals (tuple).
 * Used for AI-generated learning goals in various endpoints.
 */
export const learningGoalsSchema = z.tuple([
  learningGoalSchema,
  learningGoalSchema,
  learningGoalSchema,
]);

// Inferred TypeScript type
export type LearningGoals = z.infer<typeof learningGoalsSchema>;
