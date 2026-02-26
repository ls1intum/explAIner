/**
 * Session Domain Types
 *
 * Re-exports from generated API types for cleaner imports.
 * These types represent the API contract between frontend and backend.
 *
 * Source: Generated from OpenAPI specification
 * To regenerate: npm run generate:api-types
 */

import type { components, operations } from '../generated';

// Session-related types (response DTOs use _Output in generated schema)
export type Session = components['schemas']['GetSessionResponseDto_Output'];
export type CreateSessionRequest = components['schemas']['CreateSessionRequestDto'];
export type CreateSessionResponse = components['schemas']['CreateSessionResponseDto_Output'];
export type GetSessionRequest = operations['SessionsController_findOne']['parameters']['path'];
export type GetSessionResponse = components['schemas']['GetSessionResponseDto_Output'];
export type ContinueSessionRequest = operations['SessionsController_continue']['parameters']['path'];
export type ContinueSessionResponse = components['schemas']['ContinueSessionResponseDto_Output'];
export type DeleteSessionRequest = operations['SessionsController_remove']['parameters']['path'];
export type DeleteSessionResponse = components['schemas']['DeleteSessionResponseDto_Output'];
type SubmitFeedbackPath = operations['SessionsController_submitFeedback']['parameters']['path'];
type SubmitFeedbackBody = components['schemas']['SubmitFeedbackRequestDto'];
export type SubmitFeedbackRequest = SubmitFeedbackPath & SubmitFeedbackBody;
export type SubmitFeedbackResponse = components['schemas']['SubmitFeedbackResponseDto_Output'];
type UpdateCurrentBlockIndexPath = operations['SessionsController_updateCurrentBlockIndex']['parameters']['path'];
type UpdateCurrentBlockIndexBody = components['schemas']['UpdateCurrentBlockIndexRequestDto'];
export type UpdateCurrentBlockIndexRequest = UpdateCurrentBlockIndexPath & UpdateCurrentBlockIndexBody;
export type UpdateCurrentBlockIndexResponse = components['schemas']['UpdateCurrentBlockIndexResponseDto_Output'];
