import { z } from 'zod';
import { PracticeBlockSchema as PrismaPracticeBlockSchema } from '../../../../../prisma/generated/zod';
import { BaseBlockSchema } from '../base-block.schema';

/////////////////////////////////////////
// DOMAIN ENTITY SCHEMAS (PRISMA + EXTENSION)
/////////////////////////////////////////

export const PracticeBlockContentSchema = PrismaPracticeBlockSchema.extend({
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
export type PracticeBlockContent = z.infer<typeof PracticeBlockContentSchema>;

export const PracticeBlockSchema = BaseBlockSchema.extend({
  type: z.literal('Practice').describe('Block type'),
  content: PracticeBlockContentSchema.describe('Practice block content'),
});
export type PracticeBlock = z.infer<typeof PracticeBlockSchema>;

/////////////////////////////////////////
// SHARED / REUSABLE SCHEMAS
/////////////////////////////////////////

/** Wrong-answer context for subsequent block sequence generation (addressing misconceptions). */
export const WrongAnswerSchema = z.object({
  question: z.string(),
  correctAnswerOptions: z.array(z.string()),
  wrongStudentAnswerOptions: z.array(z.string()),
});
export type WrongAnswer = z.infer<typeof WrongAnswerSchema>;

/** Array of selected answer option indices (0-based); at least one required. Reused for submit-answer. */
const StudentAnswerOptionIndicesSchema = z
  .array(z.number().int())
  .min(1, 'At least one answer option must be selected')
  .describe('Array of selected answer option indices (0-based)');

/////////////////////////////////////////
// DTO SCHEMAS (REQUEST / RESPONSE)
/////////////////////////////////////////

/** Request: submit practice block answer. */
export const SubmitAnswerRequestSchema = z.object({
  studentAnswerOptionIndices: StudentAnswerOptionIndicesSchema,
});
export type SubmitAnswerRequest = z.infer<typeof SubmitAnswerRequestSchema>;
/** Response after persisting student answer. */
export const SubmitAnswerResponseSchema = z.object({
  success: z.boolean().describe('Whether the student answer was successfully persisted'),
  studentAnswerOptionIndices: z.array(z.number()).describe('Array of selected answer option indices (0-based)').meta({ example: [0, 2] }),
});
export type SubmitAnswerResponse = z.infer<typeof SubmitAnswerResponseSchema>;