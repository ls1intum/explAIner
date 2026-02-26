/**
 * Session domain types
 * 
 * Generated from OpenAPI specification, re-exported here for client-side usage with cleaner imports
 * For further details, see ../README.md (client/src/types/README.md)
 */

import type { components, operations } from '../generated/api.types';

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
