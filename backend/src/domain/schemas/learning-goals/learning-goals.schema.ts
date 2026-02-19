import { z } from 'zod';
import { LearningGoalSchema } from './learning-goal.schema';

/////////////////////////////////////////
// DOMAIN ENTITY SCHEMAS (PRISMA + EXTENSION)
/////////////////////////////////////////

/**
 * Learning Goals Schema – validates exactly 3 learning goals (tuple).
 */
export const LearningGoalsSchema = z.tuple([
  LearningGoalSchema,
  LearningGoalSchema,
  LearningGoalSchema,
]);
export type LearningGoals = z.infer<typeof LearningGoalsSchema>;

/////////////////////////////////////////
// SHARED / REUSABLE SCHEMAS
/////////////////////////////////////////

/** Topic + optional prior knowledge – reused by create-session and generate-learning-goals requests. */
export const TopicWithPriorKnowledgeSchema = z.object({
  topic: z.string().min(1, 'Topic cannot be empty').describe('The learning topic or question'),
  priorKnowledgeKeywords: z.string().optional().describe('Keywords describing prior knowledge (optional)'),
});

/////////////////////////////////////////
// DTO SCHEMAS (REQUEST / RESPONSE)
/////////////////////////////////////////

/** Request: generate learning goals from topic */
export const GenerateLearningGoalsRequestSchema = TopicWithPriorKnowledgeSchema;
export type GenerateLearningGoalsRequest = z.infer<typeof GenerateLearningGoalsRequestSchema>;
/** Response: array of 3 generated learning goals */
export const GenerateLearningGoalsResponseSchema = z.object({
  learningGoals: LearningGoalsSchema.describe('Array of exactly 3 generated learning goals'),
});
export type GenerateLearningGoalsResponse = z.infer<typeof GenerateLearningGoalsResponseSchema>;

/** Request: session ID for easier learning goals */
export const GenerateEasierLearningGoalsRequestSchema = z.object({
  sessionId: z.string().min(1, 'Session ID cannot be empty').describe('Session ID to generate easier learning goals for'),
});
export type GenerateEasierLearningGoalsRequest = z.infer<typeof GenerateEasierLearningGoalsRequestSchema>;
/** Response: easier learning goals with session context */
export const GenerateEasierLearningGoalsResponseSchema = z.object({
  topic: z.string().describe('The learning topic from the previous session').meta({ example: 'Photosynthesis' }),
  priorKnowledgeKeywords: z.string().optional().describe('Prior knowledge from previous session').meta({ example: 'plants, light' }),
  learningGoals: LearningGoalsSchema.describe('Array of exactly 3 easier learning goals'),
});
export type GenerateEasierLearningGoalsResponse = z.infer<typeof GenerateEasierLearningGoalsResponseSchema>;