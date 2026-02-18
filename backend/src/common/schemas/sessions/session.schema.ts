import { z } from 'zod';
import { learningGoalSchema } from '../learning-goals/learning-goal.schema';
import { blockSchema } from '../blocks/block.schema';

/**
 * Session Schema
 *
 * Defines a complete learning session with all its blocks.
 */
export const sessionSchema = z.object({
  id: z.string().describe('Unique session identifier'),
  topic: z.string().describe('Learning topic or question'),
  priorKnowledge: z.string().optional().describe('Prior knowledge keywords'),
  learningGoal: learningGoalSchema.describe('Selected learning goal'),
  totalBlocks: z.number().int().min(0).describe('Total number of blocks in the session'),
  currentBlockIndex: z.number().int().min(0).describe('Current block index (0-based)'),
  blocks: z.array(blockSchema).describe('All blocks in the session'),
});

// Inferred TypeScript type
export type Session = z.infer<typeof sessionSchema>;
