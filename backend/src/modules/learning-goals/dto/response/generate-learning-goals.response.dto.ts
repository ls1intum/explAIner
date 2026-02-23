import { createZodDto } from 'nestjs-zod';
import { GenerateLearningGoalsResponseDtoSchema } from '../../../../domain/schemas/dto/learning-goals.schema';

/**
 * Response body returning the generated learning goals
 */
export class GenerateLearningGoalsResponseDto extends createZodDto(
  GenerateLearningGoalsResponseDtoSchema,
) {}
