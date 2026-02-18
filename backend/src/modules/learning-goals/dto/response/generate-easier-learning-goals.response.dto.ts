import { createZodDto } from 'nestjs-zod';
import { generateEasierLearningGoalsResponseSchema } from '../../../../domain/schemas/learning-goals/learning-goals.schema';

/**
 * Returns a wrapped response with full context (topic, priorKnowledgeKeywords)
 * since the client only sends sessionId in the request.
 */
export class GenerateEasierLearningGoalsResponseDto extends createZodDto(
  generateEasierLearningGoalsResponseSchema,
) {}
