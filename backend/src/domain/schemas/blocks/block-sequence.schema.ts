import { z } from 'zod';
import { InformBlockSchema } from './inform/inform-block.schema';
import { PracticeBlockSchema } from './practice/practice-block.schema';
import { PracticeBlockContentSchema } from './practice/practice-block.schema';
import { KeyFactsMessageSchema } from './inform/inform-block-messages/key_facts-message.schema';
import { KeyMisconceptionsMessageSchema } from './inform/inform-block-messages/key_misconceptions-message.schema';

/////////////////////////////////////////
// DOMAIN ENTITY SCHEMAS (PRISMA + EXTENSION)
/////////////////////////////////////////

/** Block sequence generation mode: initial (keyFacts) or subsequent (keyMisconceptions). */
export const BlockSequenceModeSchema = z.enum(['initial', 'subsequent']);
export type BlockSequenceMode = z.infer<typeof BlockSequenceModeSchema>;
export const BlockSequenceMode = { INITIAL: 'initial', SUBSEQUENT: 'subsequent' } as const;

/**
 * Block Sequence Schema – 1 inform block + 3 practice blocks (API/DB shape).
 */
export const BlockSequenceSchema = z.object({
  informBlock: InformBlockSchema.describe('Inform block introducing new content'),
  practiceBlocks: z.tuple([PracticeBlockSchema, PracticeBlockSchema, PracticeBlockSchema]).describe('Exactly 3 practice blocks'),
});
export type BlockSequence = z.infer<typeof BlockSequenceSchema>;

/////////////////////////////////////////
// LLM PARSER SCHEMAS
/////////////////////////////////////////

/** Practice block question shape for AI generation (no blockId, no student answers). */
export const PracticeBlockQuestionParseSchema = PracticeBlockContentSchema.pick({
  soloLevel: true,
  question: true,
  answerOptions: true,
  correctAnswerOptionIndices: true,
});
export type PracticeBlockQuestionParse = z.infer<typeof PracticeBlockQuestionParseSchema>;

/** Block sequence parser schema for mode initial (keyFacts). */
export const InitialBlockSequenceParseSchema = z.object({
  informBlock: KeyFactsMessageSchema.describe('Inform block content with key facts'),
  practiceBlocks: z.array(PracticeBlockQuestionParseSchema).length(3, 'Must have exactly 3 practice blocks'),
});
export type InitialBlockSequenceParse = z.infer<typeof InitialBlockSequenceParseSchema>;

/** Block sequence parser schema for mode subsequent (keyMisconceptions). */
export const SubsequentBlockSequenceParseSchema = z.object({
  informBlock: KeyMisconceptionsMessageSchema.describe('Inform block content with key misconceptions'),
  practiceBlocks: z.array(PracticeBlockQuestionParseSchema).length(3, 'Must have exactly 3 practice blocks'),
});
export type SubsequentBlockSequenceParse = z.infer<typeof SubsequentBlockSequenceParseSchema>;