import { createZodDto } from 'nestjs-zod';
import { GenerateLearningGoalsRequestSchema } from '../../../../domain/schemas/learning-goals/learning-goals.schema';

/**
 * Request body for generating learning goals from topic and prior knowledge.
 */
export class GenerateLearningGoalsRequestDto extends createZodDto(
  GenerateLearningGoalsRequestSchema,
) {}
