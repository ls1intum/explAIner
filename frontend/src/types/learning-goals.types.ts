/**
 * Learning Goals Types
 *
 * Types for AI-generated learning goals and related functionality.
 */

/**
 * Learning Goal
 *
 * Represents a single learning goal with Bloom's taxonomy level.
 */
export interface LearningGoal {
  learningGoal: string;
  bloomsLevel: string;
}

/**
 * Generate Learning Goals Request
 *
 * Request payload for generating learning goals from AI.
 */
export interface GenerateLearningGoalsRequest {
  topic: string;
  priorKnowledgeKeywords?: string;
}

/**
 * Generate Learning Goals Response
 *
 * Response containing learning goals wrapped in an object.
 */
export interface GenerateLearningGoalsResponse {
  learningGoals: LearningGoal[];
}

/**
 * Generate Easier Learning Goals Request
 *
 * Request payload for generating easier learning goals based on session.
 */
export interface GenerateEasierLearningGoalsRequest {
  sessionId: string;
}

/**
 * Generate Easier Learning Goals Response
 *
 * Response containing topic, priorKnowledgeKeywords, and easier learning goals.
 */
export interface GenerateEasierLearningGoalsResponse {
  topic: string;
  priorKnowledgeKeywords: string;
  learningGoals: LearningGoal[];
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
