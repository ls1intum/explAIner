import { z } from 'zod';
import { BlockSchema } from '../../../../prisma/generated/zod';

/**
 * Base Block Schema – common fields shared by all block types (no type discriminator).
 */
export const baseBlockSchema = BlockSchema.pick({
  id: true,
  sessionId: true,
  orderIndex: true,
  alreadyViewed: true,
});
export type BaseBlock = z.infer<typeof baseBlockSchema>;
