import { z } from 'zod';
import { SoloLevel } from '@prisma/client';
import { baseBlockSchema } from './base-block.schema';

/**
 * Practice Block Content Schema
 *
 * Defines the content of a practice block including question, answers, and student responses.
 */
export const practiceBlockContentSchema = z.object({
  blockId: z.string().describe('Block ID'),
  soloLevel: z.nativeEnum(SoloLevel).describe('SOLO taxonomy level'),
  question: z.string().min(1).describe('Practice question'),
  answerOptions: z.array(z.string()).describe('Available answer options'),
  correctAnswerOptionIndices: z
    .array(z.number().int().min(0))
    .describe('Indices of correct answer options'),
  studentAnswerOptionIndices: z
    .array(z.number().int().min(0))
    .describe("Indices of student's selected answer options"),
  studentAnswerIsCorrect: z
    .boolean()
    .nullable()
    .describe("Whether the student's answer is correct (null if not yet answered)"),
});

/**
 * Practice Block Schema
 *
 * Defines a practice block with question and answer data.
 */
export const practiceBlockSchema = baseBlockSchema.extend({
  type: z.literal('Practice').describe('Block type'),
  content: practiceBlockContentSchema.describe('Practice block content'),
});

// TypeScript types
export type PracticeBlockContent = z.infer<typeof practiceBlockContentSchema>;
export type PracticeBlock = z.infer<typeof practiceBlockSchema>;
