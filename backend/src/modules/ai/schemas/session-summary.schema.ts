import { z } from 'zod';

/**
 * Session Summary Schema
 *
 * This schema defines the content for a Summary Block that is displayed
 * at the end of a learning session. Also used to generate DTOs and OpenAPI documentation.
 * The summary is stored in the summary_blocks table.
 */
export const sessionSummarySchema = z.object({
  sessionSummary: z
    .string()
    .min(1, 'Session summary must not be empty')
    .describe('Session summary content - brief recap of what was learned, blocks completed, and learning goal connection'),
});

// Inferred TypeScript type
export type SessionSummary = z.infer<typeof sessionSummarySchema>;
