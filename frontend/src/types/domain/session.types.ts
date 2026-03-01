/**
 * Session Domain Types
 *
 * Generated from OpenAPI specification, re-exported here for client-side usage with cleaner imports
 * For further details, see ../README.md (client/src/types/README.md)
 */

import type { components, operations } from '../generated/api.types';

////////////////////////////////////////////////////////////////////////////
// Session API request types
 // request type = request path params AND/OR request body {}
////////////////////////////////////////////////////////////////////////////

type CreateSessionRequestBody = components['schemas']['CreateSessionRequestDto'];
export type CreateSessionRequest = CreateSessionRequestBody;

type GetSessionRequestPathParams = operations['SessionsController_findOne']['parameters']['path'];
export type GetSessionRequest = GetSessionRequestPathParams;

type DeleteSessionRequestPathParams = operations['SessionsController_remove']['parameters']['path'];
export type DeleteSessionRequest = DeleteSessionRequestPathParams;

type UpdateCurrentBlockIndexRequestPathParams = operations['SessionsController_updateCurrentBlockIndex']['parameters']['path'];
type UpdateCurrentBlockIndexRequestBody = components['schemas']['UpdateCurrentBlockIndexRequestDto'];
export type UpdateCurrentBlockIndexRequest = UpdateCurrentBlockIndexRequestPathParams & UpdateCurrentBlockIndexRequestBody;

type ContinueSessionRequestPathParams = operations['SessionsController_continue']['parameters']['path'];
export type ContinueSessionRequest = ContinueSessionRequestPathParams;

type SubmitFeedbackRequestPathParams = operations['SessionsController_submitFeedback']['parameters']['path'];
type SubmitFeedbackRequestBody = components['schemas']['SubmitFeedbackRequestDto'];
export type SubmitFeedbackRequest = SubmitFeedbackRequestPathParams & SubmitFeedbackRequestBody;

////////////////////////////////////////////////////////////////////////////
// Session API response types
////////////////////////////////////////////////////////////////////////////

export type CreateSessionResponse = components['schemas']['CreateSessionResponseDto_Output'];

export type GetSessionResponse = components['schemas']['GetSessionResponseDto_Output'];

export type DeleteSessionResponse = components['schemas']['DeleteSessionResponseDto_Output'];

export type UpdateCurrentBlockIndexResponse = components['schemas']['UpdateCurrentBlockIndexResponseDto_Output'];

export type ContinueSessionResponse = components['schemas']['ContinueSessionResponseDto_Output'];

export type SubmitFeedbackResponse = components['schemas']['SubmitFeedbackResponseDto_Output'];
