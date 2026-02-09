/**
 * Session Domain Types
 * 
 * Re-exports from generated API types for cleaner imports.
 * These types represent the API contract between frontend and backend.
 * 
 * Source: Generated from OpenAPI specification
 * To regenerate: npm run generate:api-types
 */

import type { components } from '../generated';

// Session-related types
export type Session = components['schemas']['SessionInfoDto'];
export type CreateSessionRequest = components['schemas']['CreateSessionRequestDto'];
export type CreateSessionResponse = components['schemas']['CreateSessionResponseDto'];
export type GetSessionResponse = components['schemas']['GetSessionResponseDto'];
export type ContinueSessionResponse = components['schemas']['ContinueSessionResponseDto'];
export type DeleteSessionResponse = components['schemas']['DeleteSessionResponseDto'];
export type SubmitFeedbackResponse = components['schemas']['SubmitFeedbackResponseDto'];
export type UpdateCurrentBlockIndexResponse = components['schemas']['UpdateCurrentBlockIndexResponseDto'];
