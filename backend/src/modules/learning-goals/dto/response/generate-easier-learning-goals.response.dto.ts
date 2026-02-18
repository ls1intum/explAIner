import { createZodDto } from 'nestjs-zod';
import { generateEasierLearningGoalsResponseSchema } from '../../../../domain/schemas/learning-goals/learning-goals.schema';

/**
 * Response body returning generated easier learning goals with full context (topic, priorKnowledgeKeywords).
 */
export class GenerateEasierLearningGoalsResponseDto extends createZodDto(
  generateEasierLearningGoalsResponseSchema,
) {}
