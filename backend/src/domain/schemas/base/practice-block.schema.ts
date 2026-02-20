import { z } from 'zod';
import { SoloLevelSchema } from '../enums.schema';
import { BaseBlockSchema } from './base-block.schema';

export const PracticeBlockContentSchema = z.object({
  blockId: z.string().uuid().describe('Block ID'),
  soloLevel: SoloLevelSchema.describe('SOLO taxonomy level'),
  question: z.string().min(1, 'Practice question must not be empty').describe('Practice question'),
  answerOptions: z.array(z.string()).describe('Available answer options'),
  correctAnswerOptionIndices: z.array(z.number().int()).describe('Indices of correct answer options'),
  studentAnswerOptionIndices: z.array(z.number().int()).describe("Student's selected answer option indices"),
  studentAnswerIsCorrect: z.boolean().nullable().describe('Whether the student answer is correct (null if not yet answered)'),
});
export type PracticeBlockContent = z.infer<typeof PracticeBlockContentSchema>;

export const PracticeBlockSchema = BaseBlockSchema.extend({
  type: z.literal('Practice').describe('Block type'),
  practiceBlock: PracticeBlockContentSchema.describe('Practice block content'),
});
export type PracticeBlock = z.infer<typeof PracticeBlockSchema>;

export const WrongAnswerSchema = z.object({
  question: z.string(),
  correctAnswerOptions: z.array(z.string()),
  wrongStudentAnswerOptions: z.array(z.string()),
});
export type WrongAnswer = z.infer<typeof WrongAnswerSchema>;
