import { z } from 'zod';

// Base block
export const BaseBlockSchema = z.object({
  id: z.string().uuid().describe('Block ID'),
  sessionId: z.string().uuid().describe('Session ID this block belongs to'),
  orderIndex: z.number().int().describe('Order index of the block (0-based)'),
  alreadyViewed: z.boolean().describe('Whether the block has been viewed by the user'),
});
export type BaseBlock = z.infer<typeof BaseBlockSchema>;
