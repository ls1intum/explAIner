import { z } from 'zod';

/**
 * Summary Block Schema
 *
 * This schema defines the content for a Summary Block that is displayed
 * at the end of a learning session. The summary is stored in the
 * summary_blocks table.
 */
export const summaryBlockSchema = z.object({
  sessionSummary: z.string().min(1, 'Session summary must not be empty'), // Brief recap of what was learned, blocks completed, and learning goal connection
});

// Inferred TypeScript type
export type SummaryBlock = z.infer<typeof summaryBlockSchema>;
