import { z } from 'zod';
import { BloomsLevel } from '@prisma/client';

/**
 * Learning Goal Zod Schema
 *
 * Validates AI-generated learning goals against Prisma's BloomsLevel enum.
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
