import { z } from 'zod';
import { baseBlockSchema } from './base-block.schema';

/**
 * Inform Block Message Schema
 *
 * Defines a single message within an inform block.
 */
export const informBlockMessageSchema = z.object({
  id: z.string().describe('Message ID'),
  blockId: z.string().describe('Block ID this message belongs to'),
  message: z
    .string()
    .min(1, 'Message must not be empty')
    .describe('Message content'),
  sender: z.enum(['User', 'Owlbert']).describe('Message sender'),
  timestamp: z.string().datetime().describe('Message timestamp (ISO 8601 format)'),
});

/**
 * Inform Block Schema
 *
 * Defines an inform block with its conversation messages (flattened structure).
 */
export const informBlockSchema = baseBlockSchema.extend({
  type: z.literal('Inform').describe('Block type'),
  content: z.array(informBlockMessageSchema).describe('Inform block messages'),
});

// TypeScript types
export type InformBlockMessage = z.infer<typeof informBlockMessageSchema>;
export type InformBlock = z.infer<typeof informBlockSchema>;
