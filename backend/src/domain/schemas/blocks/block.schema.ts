import { z } from 'zod';
import { informBlockSchema } from './inform/inform-block.schema';
import { practiceBlockSchema } from './practice/practice-block.schema';
import { summaryBlockSchema } from './summary/summary-block.schema';

/////////////////////////////////////////
// DOMAIN ENTITY SCHEMAS (PRISMA + EXTENSION)
/////////////////////////////////////////

/**
 * Block Schema – discriminated union of all block types (Inform, Practice, Summary).
 */
export const blockSchema = z.discriminatedUnion('type', [
  informBlockSchema,
  practiceBlockSchema,
  summaryBlockSchema,
]);
export type Block = z.infer<typeof blockSchema>;
export { baseBlockSchema } from './base-block.schema';
