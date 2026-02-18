import { z } from 'zod';
import { learningGoalSchema } from './learning-goal.schema';

/////////////////////////////////////////
// DOMAIN ENTITY SCHEMAS (PRISMA + EXTENSION)
/////////////////////////////////////////

/**
 * Learning Goals Schema – validates exactly 3 learning goals (tuple).
 * Used for AI-generated learning goals in various endpoints.
 */
export const learningGoalsSchema = z.tuple([
  learningGoalSchema,
  learningGoalSchema,
  learningGoalSchema,
]);

export type LearningGoals = z.infer<typeof learningGoalsSchema>;

/////////////////////////////////////////
// SHARED / REUSABLE SCHEMAS
/////////////////////////////////////////

/** Topic + optional prior knowledge – reused by create-session and generate-learning-goals requests. */
export const topicWithPriorKnowledgeSchema = z.object({
  topic: z.string().min(1, 'Topic cannot be empty').describe('The learning topic or question'),
  priorKnowledgeKeywords: z.string().optional().describe('Keywords describing prior knowledge (optional)'),
});

/////////////////////////////////////////
// DTO SCHEMAS (REQUEST / RESPONSE)
/////////////////////////////////////////

/** Request: generate learning goals from topic (reuses topicWithPriorKnowledgeSchema). */
export const generateLearningGoalsRequestSchema = topicWithPriorKnowledgeSchema;
export type GenerateLearningGoalsRequest = z.infer<typeof generateLearningGoalsRequestSchema>;

/** Request: session ID for easier learning goals. */
export const generateEasierLearningGoalsRequestSchema = z.object({
  sessionId: z.string().min(1, 'Session ID cannot be empty').describe('Session ID to generate easier learning goals for'),
});
export type GenerateEasierLearningGoalsRequest = z.infer<typeof generateEasierLearningGoalsRequestSchema>;

/** Response: array of 3 generated learning goals. */
export const generateLearningGoalsResponseSchema = z.object({
  learningGoals: learningGoalsSchema.describe('Array of exactly 3 generated learning goals'),
});
export type GenerateLearningGoalsResponse = z.infer<typeof generateLearningGoalsResponseSchema>;

/** Response: easier learning goals with session context. */
export const generateEasierLearningGoalsResponseSchema = z.object({
  topic: z.string().describe('The learning topic from the previous session').meta({ example: 'Photosynthesis' }),
  priorKnowledgeKeywords: z.string().optional().describe('Prior knowledge from previous session').meta({ example: 'plants, light' }),
  learningGoals: learningGoalsSchema.describe('Array of exactly 3 easier learning goals'),
});
export type GenerateEasierLearningGoalsResponse = z.infer<typeof generateEasierLearningGoalsResponseSchema>;
