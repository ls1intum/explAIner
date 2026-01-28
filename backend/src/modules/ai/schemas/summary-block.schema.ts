import { z } from 'zod';

export const summaryBlockSchema = z.object({
  keyTakeaways: z.array(z.string()),
  sessionDuration: z.number(),
  blocksCompleted: z.number(),
  score: z.number(),
});
