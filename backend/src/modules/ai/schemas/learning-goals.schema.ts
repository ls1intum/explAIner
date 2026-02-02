import { z } from 'zod';
import { BloomsLevel } from '../../../common/types/blooms-level.enum';

/**
 * Learning Goal Zod Schema
 *
 * Validates AI-generated learning goals.
 *
 * Aligns with Prisma schema:
 * - Session.learningGoalBloomsLevel: BloomsLevel enum
 *
 * Database constraint:
 * - bloomsLevel must be one of: Remember, Understand, Apply, Analyze, Evaluate, Create
 */
export const learningGoalSchema = z.object({
  learningGoal: z.string().min(1, 'Learning goal must not be empty'),
  bloomsLevel: z.nativeEnum(BloomsLevel),
  actionVerb: z.string().min(1, 'Action verb must not be empty'),
});

/**
 * Learning Goals Array Schema
 *
 * Validates exactly 3 learning goals (tuple).
 */
export const learningGoalsArraySchema = z.tuple([
  learningGoalSchema,
  learningGoalSchema,
  learningGoalSchema,
]);
