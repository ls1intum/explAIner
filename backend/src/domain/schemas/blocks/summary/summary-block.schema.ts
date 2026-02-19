import { z } from 'zod';
import { BaseBlockSchema } from '../base-block.schema';
import { SummaryBlockSchema as PrismaSummaryBlockSchema } from '../../../../../prisma/generated/zod';

/////////////////////////////////////////
// DOMAIN ENTITY SCHEMAS (PRISMA + EXTENSION)
/////////////////////////////////////////

export const SummaryBlockContentSchema = PrismaSummaryBlockSchema.extend({
  blockId: PrismaSummaryBlockSchema.shape.blockId.describe('Block ID'),
  sessionSummary: PrismaSummaryBlockSchema.shape.sessionSummary
    .min(1, 'Summary must not be empty')
    .describe('Session summary content'),
});
export type SummaryBlockContent = z.infer<typeof SummaryBlockContentSchema>;

export const SummaryBlockSchema = BaseBlockSchema.extend({
  type: z.literal('Summary').describe('Block type'),
  content: SummaryBlockContentSchema.describe('Summary block content'),
});
export type SummaryBlock = z.infer<typeof SummaryBlockSchema>;

/////////////////////////////////////////
// LLM PARSER SCHEMAS
/////////////////////////////////////////

/** Parser schema for session-summary chain (LLM response shape: sessionSummary only). */
export const SessionSummaryParseSchema = SummaryBlockContentSchema.pick({ sessionSummary: true });
export type SessionSummaryParse = z.infer<typeof SessionSummaryParseSchema>;

/////////////////////////////////////////
// DTO SCHEMAS (REQUEST / RESPONSE)
/////////////////////////////////////////

/** Response shape for generate-summary-block endpoint. Reuses SummaryBlockSchema + session metadata. */
export const GenerateSummaryBlockResponseSchema = SummaryBlockSchema.extend({
  sessionDuration: z.number().describe('Session duration in minutes'),
  totalBlocks: z.number().describe('Total number of blocks in the session'),
});
export type GenerateSummaryBlockResponse = z.infer<typeof GenerateSummaryBlockResponseSchema>;