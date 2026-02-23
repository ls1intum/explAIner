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

type GenerateLearningGoalsOutput = components['schemas']['GenerateLearningGoalsResponseDto_Output'];
export type LearningGoal = GenerateLearningGoalsOutput['learningGoals'][number];
export type GenerateLearningGoalsRequest = components['schemas']['GenerateLearningGoalsRequestDto'];
export type GenerateLearningGoalsResponse = GenerateLearningGoalsOutput;
export type GenerateEasierLearningGoalsRequest = components['schemas']['GenerateEasierLearningGoalsRequestDto'];
export type GenerateEasierLearningGoalsResponse = components['schemas']['GenerateEasierLearningGoalsResponseDto_Output'];
