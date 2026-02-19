import { z } from 'zod';
import { InformBlockMessageSchema as PrismaInformBlockMessageSchema } from '../../../../../prisma/generated/zod';
import { BaseBlockSchema } from '../base-block.schema';

/////////////////////////////////////////
// DOMAIN ENTITY SCHEMAS (PRISMA + EXTENSION)
/////////////////////////////////////////

/** Timestamp string (e.g. ISO 8601). Avoids z.date() so schema is JSON-Schema compatible. */
const IsoDateStringSchema = z.string();

export const InformBlockMessageSchema = PrismaInformBlockMessageSchema.omit({ timestamp: true }).extend({
  id: PrismaInformBlockMessageSchema.shape.id.describe('Message ID'),
  blockId: PrismaInformBlockMessageSchema.shape.blockId.describe('Block ID this message belongs to'),
  message: PrismaInformBlockMessageSchema.shape.message.min(1, 'Message must not be empty').describe('Message content'),
  sender: PrismaInformBlockMessageSchema.shape.sender.describe('Message sender'),
  timestamp: IsoDateStringSchema.describe('Message timestamp (ISO 8601 format)'),
});
export type InformBlockMessage = z.infer<typeof InformBlockMessageSchema>;

export const InformBlockSchema = BaseBlockSchema.extend({
  type: z.literal('Inform').describe('Block type'),
  content: z.array(InformBlockMessageSchema).describe('Inform block messages'),
});
export type InformBlock = z.infer<typeof InformBlockSchema>;