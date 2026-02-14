import { z } from 'zod';
import { SoloLevel } from '@prisma/client';

/**
 * Practice Block Schema
 * 
 * Shared schema for practice blocks used in both initial and subsequent block sequences.
 * Contains 3 questions aligned with SOLO taxonomy.
 */

// Practice question schema
export const practiceQuestionSchema = z.object({
  question: z.string().min(1, 'Question must not be empty'),
  answerOptions: z.array(z.string().min(1))
    .length(4, 'Must have exactly 4 answer options'),
  correctAnswerOptionIndices: z.array(
    z.number().int().min(0).max(3, 'Answer indices must be between 0-3')
  ).min(1, 'Must have at least one correct answer'),
  soloLevel: z.nativeEnum(SoloLevel),
});

// Practice block
export const practiceBlockSchema = z.object({
  questions: z.array(practiceQuestionSchema)
    .length(3, 'Must have exactly 3 questions'),
});

// Inferred TypeScript types
export type PracticeQuestion = z.infer<typeof practiceQuestionSchema>;
export type PracticeBlock = z.infer<typeof practiceBlockSchema>;
