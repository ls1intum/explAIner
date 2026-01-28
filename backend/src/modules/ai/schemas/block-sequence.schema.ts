import { z } from 'zod';

export const blockSequenceSchema = z.object({
  blocks: z.array(z.object({
    type: z.string(),
    order: z.number(),
  })),
});
