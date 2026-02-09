/**
 * Learning Goals Domain Types
 * 
 * Re-exports from generated API types for cleaner imports.
 * These types represent the API contract between frontend and backend.
 * 
 * Source: Generated from OpenAPI specification
 * To regenerate: npm run generate:api-types
 */

import type { components } from '../generated';

// Learning Goals API types
export type LearningGoal = components['schemas']['LearningGoalDto'];
export type GenerateLearningGoalsRequest = components['schemas']['GenerateLearningGoalsRequestDto'];
export type GenerateLearningGoalsResponse = components['schemas']['GenerateLearningGoalsResponseDto'];
export type GenerateEasierLearningGoalsRequest = components['schemas']['GenerateEasierLearningGoalsRequestDto'];
export type GenerateEasierLearningGoalsResponse = components['schemas']['GenerateEasierLearningGoalsResponseDto'];
