import { z } from 'zod';
import { PracticeBlockSchema as PrismaPracticeBlockSchema } from '../../../../../prisma/generated/zod';
import { baseBlockSchema } from '../base-block.schema';

/////////////////////////////////////////
// DOMAIN ENTITY SCHEMAS (PRISMA + EXTENSION)
/////////////////////////////////////////

export const practiceBlockContentSchema = PrismaPracticeBlockSchema.extend({
  blockId: PrismaPracticeBlockSchema.shape.blockId.describe('Block ID'),
  soloLevel: PrismaPracticeBlockSchema.shape.soloLevel.describe('SOLO taxonomy level'),
  question: PrismaPracticeBlockSchema.shape.question
    .min(1, 'Practice question must not be empty')
    .describe('Practice question'),
  answerOptions: PrismaPracticeBlockSchema.shape.answerOptions.describe('Available answer options'),
  correctAnswerOptionIndices: PrismaPracticeBlockSchema.shape.correctAnswerOptionIndices.describe(
    'Indices of correct answer options',
  ),
  studentAnswerOptionIndices: PrismaPracticeBlockSchema.shape.studentAnswerOptionIndices.describe(
    "Indices of student's selected answer options",
  ),
  studentAnswerIsCorrect: PrismaPracticeBlockSchema.shape.studentAnswerIsCorrect.describe(
    "Whether the student's answer is correct (null if not yet answered)",
  ),
});
export type PracticeBlockContent = z.infer<typeof practiceBlockContentSchema>;

export const practiceBlockSchema = baseBlockSchema.extend({
  type: z.literal('Practice').describe('Block type'),
  content: practiceBlockContentSchema.describe('Practice block content'),
});
export type PracticeBlock = z.infer<typeof practiceBlockSchema>;

/////////////////////////////////////////
// SHARED / REUSABLE SCHEMAS
/////////////////////////////////////////

/** Wrong-answer context for subsequent block sequence generation (addressing misconceptions). */
export const wrongAnswerSchema = z.object({
  question: z.string(),
  correctAnswerOptions: z.array(z.string()),
  wrongStudentAnswerOptions: z.array(z.string()),
});
export type WrongAnswer = z.infer<typeof wrongAnswerSchema>;

/** Array of selected answer option indices (0-based); at least one required. Reused for submit-answer. */
const studentAnswerOptionIndicesSchema = z
  .array(z.number().int())
  .min(1, 'At least one answer option must be selected')
  .describe('Array of selected answer option indices (0-based)');

/////////////////////////////////////////
// DTO SCHEMAS (REQUEST / RESPONSE)
/////////////////////////////////////////

/** Request: submit practice block answer. */
export const submitAnswerRequestSchema = z.object({
  studentAnswerOptionIndices: studentAnswerOptionIndicesSchema,
});
export type SubmitAnswerRequest = z.infer<typeof submitAnswerRequestSchema>;
/** Response after persisting student answer. */
export const submitAnswerResponseSchema = z.object({
  success: z.boolean().describe('Whether the student answer was successfully persisted'),
  studentAnswerOptionIndices: z.array(z.number()).describe('Array of selected answer option indices (0-based)').meta({ example: [0, 2] }),
});
export type SubmitAnswerResponse = z.infer<typeof submitAnswerResponseSchema>;