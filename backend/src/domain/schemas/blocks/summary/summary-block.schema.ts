import { z } from 'zod';
import { baseBlockSchema } from '../base-block.schema';
import { SummaryBlockSchema as PrismaSummaryBlockSchema } from '../../../../../prisma/generated/zod';

/////////////////////////////////////////
// DOMAIN ENTITY SCHEMAS (PRISMA + EXTENSION)
/////////////////////////////////////////

/** Content schema derived from Prisma; refinement for non-empty summary. */
export const summaryBlockContentSchema = PrismaSummaryBlockSchema.extend({
  blockId: PrismaSummaryBlockSchema.shape.blockId.describe('Block ID'),
  sessionSummary: PrismaSummaryBlockSchema.shape.sessionSummary
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

/** Parser schema for session-summary chain (LLM response shape: sessionSummary only). */
export const sessionSummaryParseSchema = summaryBlockContentSchema.pick({ sessionSummary: true });
export type SessionSummaryParseSchema = z.infer<typeof sessionSummaryParseSchema>;

/////////////////////////////////////////
// DTO SCHEMAS (REQUEST / RESPONSE)
/////////////////////////////////////////

/** Response shape for generate-summary-block endpoint. Reuses summaryBlockSchema + session metadata. */
export const GenerateSummaryBlockResponseSchema = summaryBlockSchema.extend({
  sessionDuration: z.number().describe('Session duration in minutes'),
  totalBlocks: z.number().describe('Total number of blocks in the session'),
});
export type GenerateSummaryBlockResponse = z.infer<typeof GenerateSummaryBlockResponseSchema>;
