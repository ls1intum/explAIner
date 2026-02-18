import { z } from 'zod';
import { informBlockSchema } from './inform-block.schema';
import { practiceBlockSchema } from './practice-block.schema';
import { summaryBlockSchema } from './summary-block.schema';

/**
 * Block Schema
 *
 * Discriminated union of all block types (Inform, Practice, Summary).
 * Uses the 'type' field as discriminator for type safety.
 */
export const blockSchema = z.discriminatedUnion('type', [
  informBlockSchema,
  practiceBlockSchema,
  summaryBlockSchema,
]);

// TypeScript type
export type Block = z.infer<typeof blockSchema>;

// Re-export base schema for convenience
export { baseBlockSchema } from './base-block.schema';
