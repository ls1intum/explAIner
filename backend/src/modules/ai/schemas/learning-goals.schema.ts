import { z } from 'zod';
import { BloomsLevel } from '@prisma/client';

/**
 * Learning Goal Zod Schema
 *
 * Validates AI-generated learning goals against Prisma's BloomsLevel enum.
 * Also used to generate DTOs and OpenAPI documentation.
 *
 * Aligns with Prisma schema:
 * - Session.learningGoalBloomsLevel: BloomsLevel enum
 *
 * Database constraint:
 * - bloomsLevel must be one of: Remember, Understand, Apply, Analyze, Evaluate, Create
 */
const learningGoalSchema = z.object({
  learningGoal: z
    .string()
    .min(1, 'Learning goal must not be empty')
    .describe('The learning goal following the format "After this session, you will be able to <BloomsLevel> <objective>."')
    .meta({ example: 'After this session, you will be able to Understand the process of photosynthesis.' }),
  bloomsLevel: z
    .nativeEnum(BloomsLevel)
    .describe("Bloom's taxonomy level for this learning goal")
    .meta({ example: BloomsLevel.Understand }),
});

/**
 * Learning Goals Schema
 *
 * Validates exactly 3 learning goals (tuple).
 */
export const learningGoalsSchema = z.tuple([
  learningGoalSchema,
  learningGoalSchema,
  learningGoalSchema,
]);
