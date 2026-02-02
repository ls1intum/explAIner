/**
 * Learning Goals Types
 *
 * Types for AI-generated learning goals and related functionality.
 */

/**
 * Learning Goal
 *
 * Represents a single learning goal with Bloom's taxonomy level and action verb.
 */
export interface LearningGoal {
  learningGoal: string;
  bloomsLevel: string;
  actionVerb: string;
}

/**
 * Generate Learning Goals Request
 *
 * Request payload for generating learning goals from AI.
 */
export interface GenerateLearningGoalsRequest {
  topic: string;
  keywords?: string;
}

/**
 * Learning Goal Page Data
 *
 * Data passed between pages containing topic, keywords, and generated goals.
 */
export interface LearningGoalPageData {
  topic: string;
  keywords: string;
  goals: LearningGoal[];
}
