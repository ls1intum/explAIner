import { createZodDto } from 'nestjs-zod';
import { GenerateLearningGoalsRequestDtoSchema } from '../../../../domain/schemas/dto/learning-goals.schema';

/**
 * Request body for generating learning goals from topic and prior knowledge.
 */
export class GenerateLearningGoalsRequestDto extends createZodDto(
  GenerateLearningGoalsRequestDtoSchema,
) {}
