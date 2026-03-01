/**
 * Learning-Goals Domain Types
 *
 * Generated from OpenAPI specification, re-exported here for client-side usage with cleaner imports
 * For further details, see ../README.md (client/src/types/README.md)
 */

import type { components } from '../generated/api.types';

////////////////////////////////////////////////////////////////////////////
// Learning-Goals API request types
 // request type = request path params AND/OR request body {}
////////////////////////////////////////////////////////////////////////////

type GenerateLearningGoalsRequestBody = components['schemas']['GenerateLearningGoalsRequestDto'];
export type GenerateLearningGoalsRequest = GenerateLearningGoalsRequestBody;

type GenerateEasierLearningGoalsRequestBody = components['schemas']['GenerateEasierLearningGoalsRequestDto'];
export type GenerateEasierLearningGoalsRequest = GenerateEasierLearningGoalsRequestBody;

////////////////////////////////////////////////////////////////////////////
// Learning-Goals API response types
////////////////////////////////////////////////////////////////////////////

export type GenerateLearningGoalsResponse = components['schemas']['GenerateLearningGoalsResponseDto_Output'];

export type GenerateEasierLearningGoalsResponse = components['schemas']['GenerateEasierLearningGoalsResponseDto_Output'];

////////////////////////////////////////////////////////////////////////////
// Additional Learning-Goals types
////////////////////////////////////////////////////////////////////////////

export type LearningGoal = GenerateLearningGoalsResponse['learningGoals'][number];
