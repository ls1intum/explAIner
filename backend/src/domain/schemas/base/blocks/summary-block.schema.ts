import { z } from 'zod';
import { BaseBlockSchema } from './base-block.schema';

// Summary block content
export const SummaryBlockContentSchema = z.object({
  blockId: z.string().uuid().describe('Block ID'),
  sessionSummary: z.string().min(1, 'Summary must not be empty').describe('Session summary content'),
});
export type SummaryBlockContent = z.infer<typeof SummaryBlockContentSchema>;

// Summary block
export const SummaryBlockSchema = BaseBlockSchema.extend({
  type: z.literal('Summary').describe('Block type'),
  summaryBlock: SummaryBlockContentSchema.describe('Summary block content'),
});
export type SummaryBlock = z.infer<typeof SummaryBlockSchema>;
