import { LearningGoalDto } from './learning-goal.dto';

/**
 * Generate Learning Goals Response DTO
 *
 * Returns an array of learning goals wrapped in an object.
 */
export class GenerateLearningGoalsResponseDto {
  learningGoals: LearningGoalDto[];
}
