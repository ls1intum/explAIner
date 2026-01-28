import { z } from 'zod';

export const practiceBlockSchema = z.object({
  question: z.string(),
  options: z.array(z.object({
    id: z.string(),
    text: z.string(),
  })),
  correctAnswerId: z.string(),
  explanation: z.string(),
});
