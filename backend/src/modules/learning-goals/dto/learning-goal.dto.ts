import { BloomsLevel } from '@prisma/client';

/**
 * Learning Goal DTO
 *
 * Represents a single learning goal with Bloom's taxonomy level.
 * Used as the base DTO for all learning goal responses.
 */
export class LearningGoalDto {
  learningGoal: string;
  bloomsLevel: BloomsLevel;
}
