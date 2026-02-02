import { BloomsLevel } from './blooms-level.enum';

/**
 * Learning Goal Type
 *
 * Represents a single learning goal with Bloom's taxonomy level.
 * Used throughout the application for AI-generated learning goals.
 */
export interface LearningGoal {
  learningGoal: string;
  bloomsLevel: BloomsLevel;
}

/**
 * Learning Goals Array Type
 *
 * Tuple type representing exactly 3 learning goals.
 * Used to ensure AI generates the correct number of goals.
 */
export type LearningGoalsArray = [LearningGoal, LearningGoal, LearningGoal];
