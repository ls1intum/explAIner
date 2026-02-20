import { z } from 'zod';
import { MessageSenderSchema } from '../enums.schema';
import { BaseBlockSchema } from './base-block.schema';

// Inform block message
export const InformBlockMessageSchema = z.object({
  id: z.string().uuid().describe('Message ID'),
  informBlockId: z.string().uuid().describe('Inform block this message belongs to'),
  message: z.string().min(1, 'Message must not be empty').describe('Message content'),
  sender: MessageSenderSchema.describe('Message sender'),
  timestamp: z.string().describe('Message timestamp (ISO 8601)'),
});
export type InformBlockMessage = z.infer<typeof InformBlockMessageSchema>;

// Inform block content
export const InformBlockContentSchema = z.object({
  messages: z.array(InformBlockMessageSchema).describe('Inform block messages'),
});
export type InformBlockContent = z.infer<typeof InformBlockContentSchema>;

// Inform block
export const InformBlockSchema = BaseBlockSchema.extend({
  type: z.literal('Inform').describe('Block type'),
  informBlock: InformBlockContentSchema,
});
export type InformBlock = z.infer<typeof InformBlockSchema>;
