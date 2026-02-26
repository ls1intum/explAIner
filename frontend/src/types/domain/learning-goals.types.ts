/**
 * Learning-Goals Domain Types
 * 
 * Generated from OpenAPI specification, re-exported here for client-side usage with cleaner imports
 * For further details, see ../README.md (client/src/types/README.md)
 */

import type { components } from '../generated/api.types';

type GenerateLearningGoalsOutput = components['schemas']['GenerateLearningGoalsResponseDto_Output'];
export type LearningGoal = GenerateLearningGoalsOutput['learningGoals'][number];
export type GenerateLearningGoalsRequest = components['schemas']['GenerateLearningGoalsRequestDto'];
export type GenerateLearningGoalsResponse = GenerateLearningGoalsOutput;
export type GenerateEasierLearningGoalsRequest = components['schemas']['GenerateEasierLearningGoalsRequestDto'];
export type GenerateEasierLearningGoalsResponse = components['schemas']['GenerateEasierLearningGoalsResponseDto_Output'];
