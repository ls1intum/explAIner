import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

/**
 * Generate Learning Goals Request Schema
 *
 * Validates topic and optional prior knowledge for learning goal generation.
 */
const generateLearningGoalsRequestSchema = z.object({
  topic: z
    .string()
    .min(1, 'Topic cannot be empty')
    .describe('The learning topic or question to generate learning goals for'),
  
  priorKnowledgeKeywords: z
    .string()
    .optional()
    .describe('Keywords describing prior knowledge (optional)'),
});

/**
 * Generate Learning Goals Request DTO
 *
 * Request body for generating learning goals from topic and prior knowledge.
 */
export class GenerateLearningGoalsRequestDto extends createZodDto(
  generateLearningGoalsRequestSchema,
) {}
