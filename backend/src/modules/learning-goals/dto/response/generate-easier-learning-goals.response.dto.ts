import { createZodDto } from 'nestjs-zod';
import { GenerateEasierLearningGoalsResponseSchema } from '../../../../domain/schemas/learning-goals/learning-goals.schema';

/**
 * Response body returning generated easier learning goals with full context (topic, priorKnowledge).
 */
export class GenerateEasierLearningGoalsResponseDto extends createZodDto(
  GenerateEasierLearningGoalsResponseSchema,
) {}
