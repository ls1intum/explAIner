import { z } from 'zod';
import { InformBlockMessageSchema as PrismaInformBlockMessageSchema } from '../../../../../prisma/generated/zod';
import { BaseBlockSchema } from '../base-block.schema';

/////////////////////////////////////////
// DOMAIN ENTITY SCHEMAS (PRISMA + EXTENSION)
/////////////////////////////////////////

/** Timestamp string (ISO 8601). JSON-Schema compatible. */
const IsoDateStringSchema = z.string();

export const InformBlockMessageSchema = PrismaInformBlockMessageSchema.omit({ timestamp: true }).extend({
  id: PrismaInformBlockMessageSchema.shape.id.describe('Message ID'),
  informBlockId: PrismaInformBlockMessageSchema.shape.informBlockId.describe('Inform block this message belongs to'),
  message: PrismaInformBlockMessageSchema.shape.message.min(1, 'Message must not be empty').describe('Message content'),
  sender: PrismaInformBlockMessageSchema.shape.sender.describe('Message sender'),
  timestamp: IsoDateStringSchema.describe('Message timestamp (ISO 8601 format)'),
});
export type InformBlockMessage = z.infer<typeof InformBlockMessageSchema>;

/** Content shape of an Inform block (messages array). Reused as type of informBlock in API response. */
export const InformBlockContentSchema = z.object({
  messages: z.array(InformBlockMessageSchema).describe('Inform block messages'),
});
export type InformBlockContent = z.infer<typeof InformBlockContentSchema>;

/** API response: Inform block with relation shape (informBlock.messages). */
export const InformBlockSchema = BaseBlockSchema.extend({
  type: z.literal('Inform').describe('Block type'),
  informBlock: InformBlockContentSchema,
});
export type InformBlock = z.infer<typeof InformBlockSchema>;