import { z } from 'zod';
import { LearningGoalSchema, TopicWithPriorKnowledgeSchema } from '../base/learning-goal.schema';
import { SessionSchema } from '../base/session.schema';

const successField = z.boolean().describe('Whether the operation succeeded');

////////////////////////////////////////////////////////////
// API endpoint: sessions
////////////////////////////////////////////////////////////

// Request
export const CreateSessionRequestDtoSchema = TopicWithPriorKnowledgeSchema.extend({
  learningGoal: LearningGoalSchema.describe('Selected learning goal for this session'),
});
export type CreateSessionRequest = z.infer<typeof CreateSessionRequestDtoSchema>;



////////////////////////////////////////////////////////////
// API endpoint: sessions/:sessionId
////////////////////////////////////////////////////////////

// Response (Get Session)
export { SessionSchema };

// Response (Delete Session)
export const DeleteSessionResponseDtoSchema = z.object({ success: successField });
export type DeleteSessionResponse = z.infer<typeof DeleteSessionResponseDtoSchema>;



////////////////////////////////////////////////////////////
// API endpoint: sessions/:sessionId/continue
////////////////////////////////////////////////////////////

// Response
export const ContinueSessionResponseDtoSchema = z.object({
  action: z.enum(['navigate', 'next-sequence', 'summary', 'prompt-user']).describe('Next action').meta({ example: 'navigate' }),
  targetBlockIndex: z.number().optional().describe('Order index to navigate to (only for "navigate")').meta({ example: 3 }),
});
export type ContinueSessionResponse = z.infer<typeof ContinueSessionResponseDtoSchema>;



////////////////////////////////////////////////////////////
// API endpoint: sessions/:sessionId/current-block-index
////////////////////////////////////////////////////////////

// Request
export const UpdateCurrentBlockIndexRequestDtoSchema = z.object({
  currentBlockIndex: z.number().int().min(0, 'Block index must be 0 or greater').describe('Current block index (0-based)'),
});
export type UpdateCurrentBlockIndexRequest = z.infer<typeof UpdateCurrentBlockIndexRequestDtoSchema>;

// Response
export const UpdateCurrentBlockIndexResponseDtoSchema = z.object({
  success: successField,
  currentBlockIndex: z.number().describe('The updated current block index (0-based)'),
});
export type UpdateCurrentBlockIndexResponse = z.infer<typeof UpdateCurrentBlockIndexResponseDtoSchema>;



////////////////////////////////////////////////////////////
// API endpoint: sessions/:sessionId/feedback
////////////////////////////////////////////////////////////

// Request
export const SubmitFeedbackRequestDtoSchema = z.object({
  rating: z.number().int().min(1).max(5).describe('User rating (1–5 stars)'),
});
export type SubmitFeedbackRequest = z.infer<typeof SubmitFeedbackRequestDtoSchema>;

// Response
export const SubmitFeedbackResponseDtoSchema = z.object({
  success: successField,
  rating: z.number().describe('The submitted rating (1–5)'),
});
export type SubmitFeedbackResponse = z.infer<typeof SubmitFeedbackResponseDtoSchema>;