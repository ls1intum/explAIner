import { z } from 'zod';
import { baseBlockSchema } from './base-block.schema';

/**
 * Summary Block Content Schema
 *
 * Defines the content of a summary block.
 */
export const summaryBlockContentSchema = z.object({
  blockId: z.string().describe('Block ID'),
  sessionSummary: z
    .string()
    .min(1, 'Summary must not be empty')
    .describe('Session summary content'),
});

/**
 * Summary Block Schema
 *
 * Defines a summary block containing the session summary.
 */
export const summaryBlockSchema = baseBlockSchema.extend({
  type: z.literal('Summary').describe('Block type'),
  content: summaryBlockContentSchema.describe('Summary block content'),
});

// TypeScript types
export type SummaryBlockContent = z.infer<typeof summaryBlockContentSchema>;
export type SummaryBlock = z.infer<typeof summaryBlockSchema>;
