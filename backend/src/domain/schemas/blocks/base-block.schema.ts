import { z } from 'zod';
import { BlockSchema } from '../../../../prisma/generated/zod';

/////////////////////////////////////////
// DOMAIN ENTITY SCHEMAS (PRISMA + EXTENSION)
/////////////////////////////////////////

/**
 * Base Block Schema – common fields shared by all block types (no type discriminator).
 */
export const baseBlockSchema = BlockSchema.pick({
  id: true,
  sessionId: true,
  orderIndex: true,
  alreadyViewed: true,
}).extend({
  // Re-specify only to add .describe() for OpenAPI; validation still uses Prisma schemas.
  id: BlockSchema.shape.id.describe('Block ID'),
  sessionId: BlockSchema.shape.sessionId.describe('Session ID this block belongs to'),
  orderIndex: BlockSchema.shape.orderIndex.describe('Order index of the block (0-based)'),
  alreadyViewed: BlockSchema.shape.alreadyViewed.describe('Whether the block has been viewed by the user'),
});
export type BaseBlock = z.infer<typeof baseBlockSchema>;
