import { z } from 'zod';
import { SessionSchema } from '../../../../prisma/generated/zod';
import { learningGoalSchema } from '../learning-goals/learning-goal.schema';
import { blockSchema } from '../blocks/block.schema';

/**
 * Session Schema – API view of a learning session with blocks.
 * Derived from Prisma Session; exposes topic/priorKnowledge/learningGoal and blocks array.
 */
export const sessionSchema = SessionSchema.pick({
  id: true,
  totalBlocks: true,
  currentBlockIndex: true,
}).extend({
  topic: SessionSchema.shape.learningTopicOrQuestion.describe('Learning topic or question'),
  priorKnowledge: SessionSchema.shape.priorKnowledgeKeywords.optional().describe('Prior knowledge keywords'),
  learningGoal: learningGoalSchema.describe('Selected learning goal'),
  blocks: z.array(blockSchema).describe('All blocks in the session'),
  // Re-specify picked keys only to add .describe() for OpenAPI; validation still uses Prisma schemas.
  totalBlocks: SessionSchema.shape.totalBlocks.describe('Total number of blocks in the session'),
  currentBlockIndex: SessionSchema.shape.currentBlockIndex.describe('Current block index (0-based)'),
});

export type Session = z.infer<typeof sessionSchema>;
