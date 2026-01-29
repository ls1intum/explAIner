import { z } from 'zod';
import { BloomsLevel } from '../../../common/types/blooms-level.enum';

/**
 * Learning Goal Schema
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

// Schema for exactly 3 learning goals (tuple)
export const learningGoalsArraySchema = z.tuple([
  learningGoalSchema,
  learningGoalSchema,
  learningGoalSchema,
]);

// Inferred TypeScript types
export type LearningGoal = z.infer<typeof learningGoalSchema>;
export type LearningGoalsArray = z.infer<typeof learningGoalsArraySchema>;
