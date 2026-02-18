import { z } from 'zod';

/**
 * Base Block Schema
 *
 * Common fields shared by all block types.
 */
export const baseBlockSchema = z.object({
  id: z.string().describe('Block ID'),
  sessionId: z.string().describe('Session ID this block belongs to'),
  orderIndex: z.number().int().min(0).describe('Order index of the block (0-based)'),
  alreadyViewed: z.boolean().describe('Whether the block has been viewed by the user'),
});
