import { z } from 'zod';
import { SummaryBlockSchema } from '../../../../../prisma/generated/zod';
import { baseBlockSchema } from '../base-block.schema';

/** Content schema derived from Prisma; optional refinement for non-empty summary. */
export const summaryBlockContentSchema = SummaryBlockSchema.extend({
  blockId: SummaryBlockSchema.shape.blockId.describe('Block ID'),
  sessionSummary: SummaryBlockSchema.shape.sessionSummary
    .min(1, 'Summary must not be empty')
    .describe('Session summary content'),
});

/**
 * Summary Block Schema – block with type Summary and session summary content.
 */
export const summaryBlockSchema = baseBlockSchema.extend({
  type: z.literal('Summary').describe('Block type'),
  content: summaryBlockContentSchema.describe('Summary block content'),
});

export type SummaryBlockContent = z.infer<typeof summaryBlockContentSchema>;
export type SummaryBlock = z.infer<typeof summaryBlockSchema>;

/** Session summary only – used by AI summary chain and DTOs. */
export const sessionSummarySchema = summaryBlockContentSchema.pick({ sessionSummary: true });
export type SessionSummary = z.infer<typeof sessionSummarySchema>;

/** Response shape for generate-summary-block endpoint. */
export const GenerateSummaryBlockResponseSchema = z.object({
  summaryBlock: summaryBlockSchema.describe('Generated summary block'),
  sessionDuration: z.number().describe('Session duration in minutes'),
  totalBlocks: z.number().describe('Total number of blocks in the session'),
});
export type GenerateSummaryBlockResponse = z.infer<typeof GenerateSummaryBlockResponseSchema>;
