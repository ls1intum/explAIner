import { z } from 'zod';

export const informBlockSchema = z.object({
  title: z.string(),
  content: z.string(),
  explanation: z.string(),
  examples: z.array(z.string()).optional(),
});
