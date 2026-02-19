import { z } from 'zod';
import { BloomsLevelSchema as PrismaBloomsLevelSchema } from '../../../../prisma/generated/zod';

/////////////////////////////////////////
// DOMAIN ENTITY SCHEMAS (PRISMA + EXTENSION)
/////////////////////////////////////////

/**
 * Learning Goal Schema – single learning goal with Bloom's taxonomy level.
 * Used across AI validation, DTOs, and API responses.
 */
export const LearningGoalSchema = z.object({
  learningGoal: z
    .string()
    .min(1, 'Learning goal must not be empty')
    .describe('The learning goal following the format "After this session, you will be able to <BloomsLevel> <objective>."'),
  bloomsLevel: PrismaBloomsLevelSchema.describe("Bloom's taxonomy level for this learning goal"),
});
export type LearningGoal = z.infer<typeof LearningGoalSchema>;