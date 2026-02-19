import { z } from 'zod';
import { InformBlockMessageSchema as PrismaInformBlockMessageSchema } from '../../../../../prisma/generated/zod';
import { baseBlockSchema } from '../base-block.schema';

/////////////////////////////////////////
// DOMAIN ENTITY SCHEMAS (PRISMA + EXTENSION)
/////////////////////////////////////////

/** ISO 8601 date string – avoids z.date() so schema is JSON-Schema compatible. */
const isoDateStringSchema = z.string();

export const informBlockMessageSchema = PrismaInformBlockMessageSchema.omit({ timestamp: true }).extend({
  id: PrismaInformBlockMessageSchema.shape.id.describe('Message ID'),
  blockId: PrismaInformBlockMessageSchema.shape.blockId.describe('Block ID this message belongs to'),
  message: PrismaInformBlockMessageSchema.shape.message.min(1, 'Message must not be empty').describe('Message content'),
  sender: PrismaInformBlockMessageSchema.shape.sender.describe('Message sender'),
  timestamp: isoDateStringSchema.describe('Message timestamp (ISO 8601 format)'),
});
export type InformBlockMessage = z.infer<typeof informBlockMessageSchema>;

export const informBlockSchema = baseBlockSchema.extend({
  type: z.literal('Inform').describe('Block type'),
  content: z.array(informBlockMessageSchema).describe('Inform block messages'),
});
export type InformBlock = z.infer<typeof informBlockSchema>;