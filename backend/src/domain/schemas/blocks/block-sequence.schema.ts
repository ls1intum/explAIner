import { z } from 'zod';
import { informBlockSchema } from './inform/inform-block.schema';
import { practiceBlockSchema } from './practice/practice-block.schema';
import { practiceBlockContentSchema } from './practice/practice-block.schema';
import { keyFactsMessageSchema } from './inform/inform-block-messages/key_facts-message.schema';
import { keyMisconceptionsMessageSchema } from './inform/inform-block-messages/key_misconceptions-message.schema';

/////////////////////////////////////////
// DOMAIN ENTITY SCHEMAS (PRISMA + EXTENSION)
/////////////////////////////////////////

/** Block sequence generation mode: initial (keyFacts) or subsequent (keyMisconceptions). */
export const blockSequenceModeSchema = z.enum(['initial', 'subsequent']);
export type BlockSequenceMode = z.infer<typeof blockSequenceModeSchema>;
export const BlockSequenceMode = { INITIAL: 'initial', SUBSEQUENT: 'subsequent' } as const;

/**
 * Block Sequence Schema – 1 inform block + 3 practice blocks (API/DB shape).
 */
export const blockSequenceSchema = z.object({
  informBlock: informBlockSchema.describe('Inform block introducing new content'),
  practiceBlocks: z.tuple([practiceBlockSchema, practiceBlockSchema, practiceBlockSchema]).describe('Exactly 3 practice blocks'),
});
export type BlockSequence = z.infer<typeof blockSequenceSchema>;

/////////////////////////////////////////
// LLM PARSER SCHEMAS
/////////////////////////////////////////

/** Practice block question shape for AI generation (no blockId, no student answers). */
export const parseSchemaPracticeBlockQuestion = practiceBlockContentSchema.pick({
  soloLevel: true,
  question: true,
  answerOptions: true,
  correctAnswerOptionIndices: true,
});
export type ParseSchemaPracticeBlockQuestion = z.infer<typeof parseSchemaPracticeBlockQuestion>;

/** AI block sequence schema for mode initial (keyFacts). */
export const aiGeneratedBlockSequenceInitialSchema = z.object({
  informBlock: keyFactsMessageSchema.describe('Inform block content with key facts'),
  practiceBlocks: z.array(parseSchemaPracticeBlockQuestion).length(3, 'Must have exactly 3 practice blocks'),
});
export type AIGeneratedBlockSequenceInitial = z.infer<typeof aiGeneratedBlockSequenceInitialSchema>;

/** AI block sequence schema for mode subsequent (keyMisconceptions). */
export const aiGeneratedBlockSequenceSubsequentSchema = z.object({
  informBlock: keyMisconceptionsMessageSchema.describe('Inform block content with key misconceptions'),
  practiceBlocks: z.array(parseSchemaPracticeBlockQuestion).length(3, 'Must have exactly 3 practice blocks'),
});
export type AIGeneratedBlockSequenceSubsequent = z.infer<typeof aiGeneratedBlockSequenceSubsequentSchema>;
