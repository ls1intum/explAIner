import { z } from 'zod';

export const startNewSessionLearningGoalSchema = z.object({
  name: z.string(),
  description: z.string(),
  bloomsLevel: z.string(),
  soloLevel: z.string(),
});
