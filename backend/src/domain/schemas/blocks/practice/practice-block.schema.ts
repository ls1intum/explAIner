import { z } from 'zod';
import { PracticeBlockSchema } from '../../../../../prisma/generated/zod';
import { baseBlockSchema } from '../base-block.schema';

/** Wrong-answer context for subsequent block sequence generation (addressing misconceptions). */
export const wrongAnswerSchema = z.object({
  question: z.string(),
  correctAnswerOptions: z.array(z.string()),
  wrongStudentAnswerOptions: z.array(z.string()),
});
export type WrongAnswer = z.infer<typeof wrongAnswerSchema>;

/** Content schema derived from Prisma; optional refinement for non-empty question. */
export const practiceBlockContentSchema = PracticeBlockSchema.extend({
  blockId: PracticeBlockSchema.shape.blockId.describe('Block ID'),
  soloLevel: PracticeBlockSchema.shape.soloLevel.describe('SOLO taxonomy level'),
  question: PracticeBlockSchema.shape.question
    .min(1, 'Practice question must not be empty')
    .describe('Practice question'),
  answerOptions: PracticeBlockSchema.shape.answerOptions.describe('Available answer options'),
  correctAnswerOptionIndices: PracticeBlockSchema.shape.correctAnswerOptionIndices.describe(
    'Indices of correct answer options',
  ),
  studentAnswerOptionIndices: PracticeBlockSchema.shape.studentAnswerOptionIndices.describe(
    "Indices of student's selected answer options",
  ),
  studentAnswerIsCorrect: PracticeBlockSchema.shape.studentAnswerIsCorrect.describe(
    "Whether the student's answer is correct (null if not yet answered)",
  ),
});

/**
 * Practice Block Schema – block with type Practice and question/answer content.
 */
export const practiceBlockSchema = baseBlockSchema.extend({
  type: z.literal('Practice').describe('Block type'),
  content: practiceBlockContentSchema.describe('Practice block content'),
});

export type PracticeBlockContent = z.infer<typeof practiceBlockContentSchema>;
export type PracticeBlock = z.infer<typeof practiceBlockSchema>;
