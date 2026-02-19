import { z } from 'zod';
import { InformBlockMessageSchema as PrismaInformBlockMessageSchema } from '../../../../../prisma/generated/zod';
import { BaseBlockSchema } from '../base-block.schema';

/////////////////////////////////////////
// DOMAIN ENTITY SCHEMAS (PRISMA + EXTENSION)
/////////////////////////////////////////

/** Timestamp string (e.g. ISO 8601). Avoids z.date() so schema is JSON-Schema compatible. */
const IsoDateStringSchema = z.string();

// timestamp overridden for JSON-Schema compatibility
export const InformBlockMessageSchema = PrismaInformBlockMessageSchema.omit({
  timestamp: true,
}).extend({
  id: PrismaInformBlockMessageSchema.shape.id.describe('Message ID'),
  informBlockId: PrismaInformBlockMessageSchema.shape.informBlockId.describe('Inform block this message belongs to'),
  message: PrismaInformBlockMessageSchema.shape.message.min(1, 'Message must not be empty').describe('Message content'),
  sender: PrismaInformBlockMessageSchema.shape.sender.describe('Message sender'),
  timestamp: IsoDateStringSchema.describe('Message timestamp (ISO 8601 format)'),
});
export type InformBlockMessage = z.infer<typeof InformBlockMessageSchema>;

/** Inform block content: array of chat messages (same shape as PracticeBlockContentSchema / SummaryBlockContentSchema). */
export const InformBlockContentSchema = z
  .array(InformBlockMessageSchema)
  .describe('Inform block messages');
export type InformBlockContent = z.infer<typeof InformBlockContentSchema>;

export const InformBlockSchema = BaseBlockSchema.extend({
  type: z.literal('Inform').describe('Block type'),
  content: InformBlockContentSchema.describe('Inform block content'),
});
export type InformBlock = z.infer<typeof InformBlockSchema>;