import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { BloomsLevel } from '@prisma/client';

/**
 * Create Session Request Schema
 *
 * Validates session creation with topic, learning goal, and Bloom's level.
 */
const createSessionRequestSchema = z.object({
  topic: z
    .string()
    .min(1, 'Topic cannot be empty')
    .describe('The learning topic or question for the session'),
  
  priorKnowledgeKeywords: z
    .string()
    .optional()
    .describe('Keywords indicating what the user already knows about the learning topic or question (optional)'),
  
  learningGoal: z
    .string()
    .min(1, 'Learning goal cannot be empty')
    .describe('The specific learning goal for this session'),
  
  bloomsLevel: z
    .nativeEnum(BloomsLevel)
    .describe("Bloom's taxonomy level for the learning goal"),
});

/**
 * Create Session Request DTO
 *
 * Request body for creating a new learning session.
 */
export class CreateSessionRequestDto extends createZodDto(
  createSessionRequestSchema,
) {}
