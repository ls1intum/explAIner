import { z } from 'zod';
import { SoloLevel } from '@prisma/client';

/**
 * Practice Block Schema
 * 
 * Defines the structure of a single practice block (one question).
 * Used in both initial and subsequent block sequences.
 * Also used to generate DTOs and OpenAPI documentation.
 * A complete sequence contains 3 practice blocks.
 */

// Single practice block schema (one question)
export const practiceBlockSchema = z.object({
  question: z
    .string()
    .min(1, 'Question must not be empty')
    .describe('Practice question text'),
  answerOptions: z
    .array(z.string().min(1))
    .length(4, 'Must have exactly 4 answer options')
    .describe('Available answer options (exactly 4)'),
  correctAnswerOptionIndices: z
    .array(z.number().int().min(0).max(3, 'Answer indices must be between 0-3'))
    .min(1, 'Must have at least one correct answer')
    .describe('Indices of correct answer options (0-3)'),
  soloLevel: z
    .nativeEnum(SoloLevel)
    .describe('SOLO taxonomy level'),
});

// Inferred TypeScript type
export type PracticeBlock = z.infer<typeof practiceBlockSchema>;
