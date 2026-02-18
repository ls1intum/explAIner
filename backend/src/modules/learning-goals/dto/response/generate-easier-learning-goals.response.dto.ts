import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { learningGoalsSchema } from '../../../../common/schemas/learning-goals/learning-goals.schema';

/**
 * Generate Easier Learning Goals Response Schema
 *
 * API-specific wrapper with session context.
 */
const generateEasierLearningGoalsResponseSchema = z.object({
  topic: z
    .string()
    .describe('The learning topic from the previous session')
    .meta({ example: 'Photosynthesis' }),
  priorKnowledgeKeywords: z
    .string()
    .optional()
    .describe('Prior knowledge keywords from the previous session')
    .meta({ example: 'plants, light' }),
  learningGoals: learningGoalsSchema.describe('Array of exactly 3 easier learning goals generated for new session'),
});

/**
 * Generate Easier Learning Goals Response DTO
 *
 * Returns a wrapped response with full context (topic, priorKnowledgeKeywords)
 * since the client only sends sessionId in the request.
 */
export class GenerateEasierLearningGoalsResponseDto extends createZodDto(generateEasierLearningGoalsResponseSchema) {}
