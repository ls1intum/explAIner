import { createZodDto } from 'nestjs-zod';
import { GenerateEasierLearningGoalsRequestDtoSchema } from '../../../../domain/schemas/dto/learning-goals.schema';

/**
 * Request body for generating easier learning goals based on previous session
 */
export class GenerateEasierLearningGoalsRequestDto extends createZodDto(
  GenerateEasierLearningGoalsRequestDtoSchema,
) {}
