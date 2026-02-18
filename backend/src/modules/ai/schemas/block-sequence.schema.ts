import { z } from 'zod';
import { practiceBlockContentSchema } from '../../../common/schemas/blocks/practice-block.schema';

/**
 * Unified Inform Block Schema for AI Generation
 * 
 * AI generates structured content that will be formatted into a message.
 * The keyPoints array contains either keyFacts (initial) or keyMisconceptions (subsequent).
 */
export const ParseSchemaFirstInformBlockMessage = z.object({
  explanation: z
    .string()
    .min(1, 'Explanation must not be empty')
    .describe('Detailed explanation of the topic'),
  keyPoints: z
    .array(z.string().min(1))
    .min(2)
    .max(4, 'Must have 2-4 key points')
    .describe('Key facts (initial) or key misconceptions (subsequent)'),
  summary: z
    .string()
    .min(1, 'Summary must not be empty')
    .describe('Brief summary of the explanation'),
});

export type ParseSchemaFirstInformBlockMessage = z.infer<typeof ParseSchemaFirstInformBlockMessage>;

/**
 * Practice Block Schema for AI Generation
 * 
 * Reuses fields from common practice block content schema.
 * Excludes blockId and student answer fields (populated later).
 */
export const ParseSchemaPracticeBlockQuestion = practiceBlockContentSchema.pick({
  soloLevel: true,
  question: true,
  answerOptions: true,
  correctAnswerOptionIndices: true,
});

export type ParseSchemaPracticeBlockQuestion = z.infer<typeof ParseSchemaPracticeBlockQuestion>;

/**
 * Unified Block Sequence Schema for AI Generation
 * 
 * Used for both initial and subsequent block sequences.
 * Contains: 1 inform block + 3 practice blocks
 */
export const aiGeneratedBlockSequenceSchema = z.object({
  informBlock: ParseSchemaFirstInformBlockMessage.describe('Inform block content'),
  practiceBlocks: z
    .array(ParseSchemaPracticeBlockQuestion)
    .length(3, 'Must have exactly 3 practice blocks')
    .describe('Array of 3 practice blocks'),
});

export type AIGeneratedBlockSequence = z.infer<typeof aiGeneratedBlockSequenceSchema>;
