import { z } from 'zod';
import { LearningGoalsSchema, TopicWithPriorKnowledgeSchema } from '../base/learning-goal.schema';

////////////////////////////////////////////////////////////
// API endpoint: learning-goals
////////////////////////////////////////////////////////////

// Request
export const GenerateLearningGoalsRequestDtoSchema = TopicWithPriorKnowledgeSchema;
export type GenerateLearningGoalsRequest = z.infer<typeof GenerateLearningGoalsRequestDtoSchema>;

// Response
export const GenerateLearningGoalsResponseDtoSchema = z.object({
  learningGoals: LearningGoalsSchema.describe('Array of exactly 3 generated learning goals'),
});
export type GenerateLearningGoalsResponse = z.infer<typeof GenerateLearningGoalsResponseDtoSchema>;

////////////////////////////////////////////////////////////
// API endpoint: learning-goals/easier
////////////////////////////////////////////////////////////

// Request
export const GenerateEasierLearningGoalsRequestDtoSchema = z.object({
  sessionId: z.string().min(1, 'Session ID cannot be empty').describe('Session ID'),
});
export type GenerateEasierLearningGoalsRequest = z.infer<typeof GenerateEasierLearningGoalsRequestDtoSchema>;

// Response
export const GenerateEasierLearningGoalsResponseDtoSchema = z.object({
  topic: z.string().describe('Learning topic from the previous session').meta({ example: 'Photosynthesis' }),
  priorKnowledge: z.string().optional().describe('Prior knowledge from previous session').meta({ example: 'plants, light' }),
  learningGoals: LearningGoalsSchema.describe('Array of exactly 3 easier learning goals'),
});
export type GenerateEasierLearningGoalsResponse = z.infer<typeof GenerateEasierLearningGoalsResponseDtoSchema>;