import { z } from 'zod';
import { InformBlockMessageSchema } from '../../../../../prisma/generated/zod';
import { baseBlockSchema } from '../base-block.schema';

/////////////////////////////////////////
// DOMAIN ENTITY SCHEMAS (PRISMA + EXTENSION)
/////////////////////////////////////////

/** ISO 8601 date string – avoids z.date() so schema is JSON-Schema compatible. */
const isoDateStringSchema = z.string();

/** Message schema derived from Prisma; timestamp as ISO string for API/OpenAPI compatibility. */
export const informBlockMessageSchema = InformBlockMessageSchema.omit({ timestamp: true }).extend({
  id: InformBlockMessageSchema.shape.id.describe('Message ID'),
  blockId: InformBlockMessageSchema.shape.blockId.describe('Block ID this message belongs to'),
  message: InformBlockMessageSchema.shape.message.min(1, 'Message must not be empty').describe('Message content'),
  sender: InformBlockMessageSchema.shape.sender.describe('Message sender'),
  timestamp: isoDateStringSchema.describe('Message timestamp (ISO 8601 format)'),
});

/**
 * Inform Block Schema – block with type Inform and array of messages.
 */
export const informBlockSchema = baseBlockSchema.extend({
  type: z.literal('Inform').describe('Block type'),
  content: z.array(informBlockMessageSchema).describe('Inform block messages'),
});

export type InformBlockMessage = z.infer<typeof informBlockMessageSchema>;
export type InformBlock = z.infer<typeof informBlockSchema>;
