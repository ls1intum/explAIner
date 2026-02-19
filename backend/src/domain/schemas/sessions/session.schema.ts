import { z } from 'zod';
import { BloomsLevelSchema as PrismaBloomsLevelSchema, SessionSchema as PrismaSessionSchema } from '../../../../prisma/generated/zod';
import { learningGoalSchema } from '../learning-goals/learning-goal.schema';
import { topicWithPriorKnowledgeSchema } from '../learning-goals/learning-goals.schema';
import { blockSchema } from '../blocks/block.schema';

/////////////////////////////////////////
// DOMAIN ENTITY SCHEMAS (PRISMA + EXTENSION)
/////////////////////////////////////////

/**
 * Session Schema – API view of a learning session with blocks.
 * Derived from Prisma Session; exposes topic/priorKnowledge/learningGoal and blocks array.
 */
export const sessionSchema = PrismaSessionSchema.pick({
  id: true,
  totalBlocks: true,
  currentBlockIndex: true,
}).extend({
  topic: PrismaSessionSchema.shape.learningTopicOrQuestion.describe('Learning topic or question'),
  priorKnowledge: PrismaSessionSchema.shape.priorKnowledgeKeywords.optional().describe('Prior knowledge keywords'),
  learningGoal: learningGoalSchema.describe('Selected learning goal'),
  blocks: z.array(blockSchema).describe('All blocks in the session'),
  // Re-specify picked keys only to add .describe() for OpenAPI; validation still uses Prisma schemas.
  totalBlocks: PrismaSessionSchema.shape.totalBlocks.describe('Total number of blocks in the session'),
  currentBlockIndex: PrismaSessionSchema.shape.currentBlockIndex.describe('Current block index (0-based)'),
});

export type Session = z.infer<typeof sessionSchema>;

/////////////////////////////////////////
// DTO SCHEMAS (REQUEST / RESPONSE)
/////////////////////////////////////////

const successField = z.boolean().describe('Whether the operation succeeded');

/** Request: current block index (0-based). */
export const updateCurrentBlockIndexRequestSchema = z.object({
  currentBlockIndex: z
    .number()
    .int()
    .min(0, 'Block index must be 0 or greater')
    .describe('The index of the current block being viewed (0-based) by the user'),
});
export type UpdateCurrentBlockIndexRequest = z.infer<typeof updateCurrentBlockIndexRequestSchema>;

/** Response after updating current block index. */
export const updateCurrentBlockIndexResponseSchema = z.object({
  success: successField,
  currentBlockIndex: z.number().describe('The updated current block index (0-based)'),
});
export type UpdateCurrentBlockIndexResponse = z.infer<typeof updateCurrentBlockIndexResponseSchema>;



/** Request: create session (reuses topic + priorKnowledge from learning-goals). */
export const createSessionRequestSchema = topicWithPriorKnowledgeSchema.extend({
  learningGoal: z.string().min(1, 'Learning goal cannot be empty').describe('The specific learning goal for this session'),
  bloomsLevel: PrismaBloomsLevelSchema.describe("Bloom's taxonomy level for the learning goal"),
});
export type CreateSessionRequest = z.infer<typeof createSessionRequestSchema>;



/** Request: user rating 1-5 stars. */
export const submitFeedbackRequestSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5')
    .describe('User rating for the session (1-5 stars) - 1: "very unhelpful", 5: "very helpful"'),
});
export type SubmitFeedbackRequest = z.infer<typeof submitFeedbackRequestSchema>;

/** Response after submitting feedback. */
export const submitFeedbackResponseSchema = z.object({
  success: successField,
  rating: z.number().describe('The submitted rating (1-5) - 1: "very unhelpful", 5: "very helpful"'),
});
export type SubmitFeedbackResponse = z.infer<typeof submitFeedbackResponseSchema>;



/** Response: next action in session flow. */
export const continueSessionResponseSchema = z.object({
  action: z
    .enum(['navigate', 'next-sequence', 'summary', 'prompt-user'])
    .describe('Next action to take in the session flow')
    .meta({ example: 'navigate' }),
  targetBlockIndex: z.number().optional().describe('Order index to navigate to (only for "navigate")').meta({ example: 3 }),
});
export type ContinueSessionResponse = z.infer<typeof continueSessionResponseSchema>;



/** Response after deleting session. */
export const deleteSessionResponseSchema = z.object({ success: successField });
export type DeleteSessionResponse = z.infer<typeof deleteSessionResponseSchema>;
