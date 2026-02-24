import { z } from 'zod';
import { SummaryBlockContentSchema } from '../base/blocks/summary-block.schema';

///////////////////////////////////////////////////////////////////////////
// chain: generate-session-summary
/////////////////////////////////////////////////////////////////////////// 

export const SessionSummaryParserSchema = SummaryBlockContentSchema.pick({ sessionSummary: true });
export type SessionSummaryParser = z.infer<typeof SessionSummaryParserSchema>;