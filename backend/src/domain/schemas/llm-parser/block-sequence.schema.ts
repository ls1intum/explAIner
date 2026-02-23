import { z } from 'zod';
import { PracticeBlockContentSchema } from '../base/blocks/practice-block.schema';

////////////////////////////////////////////////////////////
// chain: generate-block-sequence
// block-sequence-modes: INITIAL and SUBSEQUENT
////////////////////////////////////////////////////////////

///////////////////////////////////
// independent of block-sequence-mode
///////////////////////////////////

// Block sequence (initial or subsequent)
export type BlockSequenceParser = InitialBlockSequenceParser | SubsequentBlockSequenceParser;

// Practice block question
export const PracticeBlockQuestionParserSchema = PracticeBlockContentSchema.pick({
  soloLevel: true,
  question: true,
  answerOptions: true,
  correctAnswerOptionIndices: true,
});
export type PracticeBlockQuestionParser = z.infer<typeof PracticeBlockQuestionParserSchema>;

///////////////////////////////////
// block-sequence-mode: INITIAL
///////////////////////////////////

// First inform block message (in initial block sequence)
export const KeyFactsMessageParserSchema = z.object({
  explanation: z.string().min(1).describe('Detailed explanation of the topic'),
  keyFacts: z.array(z.string().min(1)).min(2).max(4, 'Must have 2-4 key facts').describe('Key facts'),
  summary: z.string().min(1).describe('Brief summary'),
});
export type KeyFactsMessageParser = z.infer<typeof KeyFactsMessageParserSchema>;

// Initial block sequence
export const InitialBlockSequenceParserSchema = z.object({
  informBlock: KeyFactsMessageParserSchema.describe('Inform block content with key facts'),
  practiceBlocks: z.array(PracticeBlockQuestionParserSchema).length(3, 'Must have exactly 3 practice blocks'),
});
export type InitialBlockSequenceParser = z.infer<typeof InitialBlockSequenceParserSchema>;

///////////////////////////////////
// block-sequence-mode: SUBSEQUENT
///////////////////////////////////

// First inform block message (in subsequent block sequence)
export const KeyMisconceptionsMessageParserSchema = z.object({
  explanation: z.string().min(1).describe('Explanation addressing misconceptions'),
  keyMisconceptions: z.array(z.string().min(1)).min(2).max(4, 'Must have 2-4 key misconceptions').describe('Key misconceptions'),
  summary: z.string().min(1).describe('Brief summary'),
});
export type KeyMisconceptionsMessageParser = z.infer<typeof KeyMisconceptionsMessageParserSchema>;

// Subsequent block sequence
export const SubsequentBlockSequenceParserSchema = z.object({
  informBlock: KeyMisconceptionsMessageParserSchema.describe('Inform block content with key misconceptions'),
  practiceBlocks: z.array(PracticeBlockQuestionParserSchema).length(3, 'Must have exactly 3 practice blocks'),
});
export type SubsequentBlockSequenceParser = z.infer<typeof SubsequentBlockSequenceParserSchema>;

// Wrong answer (LLM context for subsequent block sequence generation)
export const WrongAnswerSchema = z.object({
  question: z.string(),
  correctAnswerOptions: z.array(z.string()),
  wrongStudentAnswerOptions: z.array(z.string()),
});
export type WrongAnswer = z.infer<typeof WrongAnswerSchema>;