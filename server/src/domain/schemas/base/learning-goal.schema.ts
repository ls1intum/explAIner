import { z } from 'zod';
import { BloomsLevelSchema } from '../enums.schema';

// Learning goal
export const LearningGoalSchema = z.object({
  learningGoal: z.string().min(1, 'Learning goal must not be empty').describe('Learning goal text'),
  bloomsLevel: BloomsLevelSchema.describe("Bloom's taxonomy level"),
});
export type LearningGoal = z.infer<typeof LearningGoalSchema>;

// Learning goals
export const LearningGoalsSchema = z.tuple([LearningGoalSchema, LearningGoalSchema, LearningGoalSchema]);
export type LearningGoals = z.infer<typeof LearningGoalsSchema>;

// Topic + prior knowledge
export const TopicWithPriorKnowledgeSchema = z.object({
  topic: z.string().min(1, 'Topic cannot be empty').describe('Learning topic or question'),
  priorKnowledge: z.string().optional().describe('Prior knowledge (optional)'),
});
