import { z } from 'zod';
import { BlockSchema as PrismaBlockSchema } from '../../../../prisma/generated/zod';

/////////////////////////////////////////
// DOMAIN ENTITY SCHEMAS (PRISMA + EXTENSION)
/////////////////////////////////////////

/**
 * Base Block Schema – common fields shared by all block types (no type discriminator).
 */
export const baseBlockSchema = PrismaBlockSchema.pick({
  id: true,
  sessionId: true,
  orderIndex: true,
  alreadyViewed: true,
}).extend({
  // Re-specify only to add .describe() for OpenAPI; validation still uses Prisma schemas.
  id: PrismaBlockSchema.shape.id.describe('Block ID'),
  sessionId: PrismaBlockSchema.shape.sessionId.describe('Session ID this block belongs to'),
  orderIndex: PrismaBlockSchema.shape.orderIndex.describe('Order index of the block (0-based)'),
  alreadyViewed: PrismaBlockSchema.shape.alreadyViewed.describe('Whether the block has been viewed by the user'),
});
export type BaseBlock = z.infer<typeof baseBlockSchema>;
