import { z } from 'zod';
import { summaryBlockContentSchema } from '../../../../domain/schemas/blocks/summary-block.schema';

/**
 * Session Summary Schema (AI-specific)
 *
 * Picks the sessionSummary field from the summary block content schema for AI chain validation.
 * This schema defines the content for a Summary Block that is displayed
 * at the end of a learning session. Also used to generate DTOs and OpenAPI documentation.
 * The summary is stored in the summary_blocks table.
 */
export const sessionSummarySchema = summaryBlockContentSchema.pick({
  sessionSummary: true,
});

// Inferred TypeScript type
export type SessionSummary = z.infer<typeof sessionSummarySchema>;
