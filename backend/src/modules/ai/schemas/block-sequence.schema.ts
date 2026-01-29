import { z } from 'zod';
import { SOLOLevel } from '../constants/solo-taxonomy.constants';

/**
 * Block Sequence Schema
 * 
 * This schema combines an Inform Block and a Practice Block.
 * Used for both initial and subsequent block sequences.
 * 
 * Initial Inform Block (block_sequence_counter = 0) contains:
 * - summary, keyFacts, explanation
 * 
 * Subsequent Inform Block (block_sequence_counter > 0) contains:
 * - summary, keyMisconceptions, explanation
 * 
 * Practice Block contains 3 questions aligned with SOLO taxonomy.
 */

// Practice question schema
const practiceQuestionSchema = z.object({
  question: z.string().min(1, 'Question must not be empty'),
  answerOptions: z.array(z.string().min(1))
    .length(4, 'Must have exactly 4 answer options'),
  correctAnswerOptionIndices: z.array(
    z.number().int().min(0).max(3, 'Answer indices must be between 0-3')
  ).min(1, 'Must have at least one correct answer'),
  soloLevel: z.nativeEnum(SOLOLevel),
});

// Initial inform block (keyFacts)
const initialInformBlockSchema = z.object({
  summary: z.string().min(1, 'Summary must not be empty'),
  keyFacts: z.array(z.string().min(1)).min(2).max(4, 'Must have 2-4 key facts'),
  explanation: z.string().min(1, 'Explanation must not be empty'),
});

// Subsequent inform block (keyMisconceptions)
const subsequentInformBlockSchema = z.object({
  summary: z.string().min(1, 'Summary must not be empty'),
  keyMisconceptions: z.array(z.string().min(1)).min(1, 'Must have at least 1 key misconception'),
  explanation: z.string().min(1, 'Explanation must not be empty'),
});

// Practice block
const practiceBlockSchema = z.object({
  questions: z.array(practiceQuestionSchema)
    .length(3, 'Must have exactly 3 questions'),
});

// Combined block sequence schemas
export const initialBlockSequenceSchema = z.object({
  informBlock: initialInformBlockSchema,
  practiceBlock: practiceBlockSchema,
});

export const subsequentBlockSequenceSchema = z.object({
  informBlock: subsequentInformBlockSchema,
  practiceBlock: practiceBlockSchema,
});

// Inferred TypeScript types
export type PracticeQuestion = z.infer<typeof practiceQuestionSchema>;
export type InitialInformBlock = z.infer<typeof initialInformBlockSchema>;
export type SubsequentInformBlock = z.infer<typeof subsequentInformBlockSchema>;
export type PracticeBlock = z.infer<typeof practiceBlockSchema>;
export type InitialBlockSequence = z.infer<typeof initialBlockSequenceSchema>;
export type SubsequentBlockSequence = z.infer<typeof subsequentBlockSequenceSchema>;
