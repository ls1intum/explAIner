import { createZodDto } from 'nestjs-zod';
import { GenerateEasierLearningGoalsResponseDtoSchema } from '../../../../domain/schemas/dto/learning-goals.schema';

/**
 * Response body returning generated easier learning goals with full context (topic, priorKnowledge).
 */
export class GenerateEasierLearningGoalsResponseDto extends createZodDto(
  GenerateEasierLearningGoalsResponseDtoSchema,
) {}
