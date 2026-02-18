import { z } from 'zod';

/**
 * Inform Block Content Schema
 *
 * Defines a message within an inform block with metadata.
 * Represents a single message exchange in the inform block's conversation.
 */
export const informBlockContentSchema = z.object({
  id: z.string().describe('Message ID'),
  blockId: z.string().describe('Block ID this message belongs to'),
  message: z
    .string()
    .min(1, 'Message must not be empty')
    .describe('Message content'),
  sender: z.enum(['User', 'Owlbert']).describe('Message sender'),
  timestamp: z.string().datetime().describe('Message timestamp (ISO 8601 format)'),
});

// Inferred TypeScript type
export type InformBlockContent = z.infer<typeof informBlockContentSchema>;
