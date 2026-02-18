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
  question: PracticeBlockSchema.shape.question.min(1, 'Practice question must not be empty'),
});

/**
 * Practice Block Schema – block with type Practice and question/answer content.
 */
export const practiceBlockSchema = baseBlockSchema.extend({
  type: z.literal('Practice'),
  content: practiceBlockContentSchema,
});

export type PracticeBlockContent = z.infer<typeof practiceBlockContentSchema>;
export type PracticeBlock = z.infer<typeof practiceBlockSchema>;
