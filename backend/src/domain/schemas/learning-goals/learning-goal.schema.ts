import { z } from 'zod';
import { BloomsLevelSchema } from '../../../../prisma/generated/zod';

/**
 * Learning Goal Schema
 * Single learning goal with Bloom's taxonomy level. Used across AI validation, DTOs, and API responses.
 */
export const learningGoalSchema = z.object({
  learningGoal: z
    .string()
    .min(1, 'Learning goal must not be empty')
    .describe('The learning goal following the format "After this session, you will be able to <BloomsLevel> <objective>."'),
  bloomsLevel: BloomsLevelSchema.describe("Bloom's taxonomy level for this learning goal"),
});

// Inferred TypeScript type
export type LearningGoal = z.infer<typeof learningGoalSchema>;
