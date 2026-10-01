import { z } from 'zod';
import { BlockSchema } from './blocks/block.schema';
import { LearningGoalSchema } from './learning-goal.schema';

// Session
export const SessionSchema = z.object({
  id: z.string().uuid().describe('Session ID'),
  topic: z.string().describe('Learning topic or question'),
  priorKnowledge: z.string().optional().describe('Prior knowledge keywords'),
  learningGoal: LearningGoalSchema.describe('Selected learning goal'),
  totalBlocks: z.number().int().describe('Total number of blocks in the session'),
  currentBlockIndex: z.number().int().describe('Current block index (0-based)'),
  blocks: z.array(BlockSchema).describe('All blocks in the session'),
  practiceGenerationError: z.enum(['llm_unavailable', 'failed']).nullable().optional().describe('Sigil only: why the async practice generation failed (null = no failure)'),
});
export type Session = z.infer<typeof SessionSchema>;
