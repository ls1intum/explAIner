import { z } from 'zod';
import { InformBlockSchema } from './inform/inform-block.schema';
import { PracticeBlockSchema } from './practice/practice-block.schema';
import { SummaryBlockSchema } from './summary/summary-block.schema';

/////////////////////////////////////////
// DOMAIN ENTITY SCHEMAS (PRISMA + EXTENSION)
/////////////////////////////////////////

/**
 * Block Schema – discriminated union of all block types (Inform, Practice, Summary).
 */
export const BlockSchema = z.discriminatedUnion('type', [
  InformBlockSchema,
  PracticeBlockSchema,
  SummaryBlockSchema,
]);
export type Block = z.infer<typeof BlockSchema>;