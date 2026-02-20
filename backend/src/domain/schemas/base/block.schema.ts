import { z } from 'zod';
import { InformBlockSchema } from './inform-block.schema';
import { PracticeBlockSchema } from './practice-block.schema';
import { SummaryBlockSchema } from './summary-block.schema';

export const BlockSchema = z.discriminatedUnion('type', [
  InformBlockSchema,
  PracticeBlockSchema,
  SummaryBlockSchema,
]);
export type Block = z.infer<typeof BlockSchema>;
