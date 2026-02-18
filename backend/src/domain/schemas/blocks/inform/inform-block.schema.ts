import { z } from 'zod';
import { InformBlockMessageSchema } from '../../../../../prisma/generated/zod';
import { baseBlockSchema } from '../base-block.schema';

/** ISO 8601 date string – avoids z.date() so schema is JSON-Schema compatible. */
const isoDateStringSchema = z.string();

/** Message schema derived from Prisma; timestamp as ISO string for API/OpenAPI compatibility. */
export const informBlockMessageSchema = InformBlockMessageSchema.omit({ timestamp: true }).extend({
  message: InformBlockMessageSchema.shape.message.min(1, 'Message must not be empty'),
  timestamp: isoDateStringSchema,
});

/**
 * Inform Block Schema – block with type Inform and array of messages.
 */
export const informBlockSchema = baseBlockSchema.extend({
  type: z.literal('Inform'),
  content: z.array(informBlockMessageSchema),
});

export type InformBlockMessage = z.infer<typeof informBlockMessageSchema>;
export type InformBlock = z.infer<typeof informBlockSchema>;
