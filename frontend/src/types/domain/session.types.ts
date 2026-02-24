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

// Session-related types (response DTOs use _Output in generated schema)
export type Session = components['schemas']['GetSessionResponseDto_Output'];
export type CreateSessionRequest = components['schemas']['CreateSessionRequestDto'];
export type CreateSessionResponse = components['schemas']['CreateSessionResponseDto_Output'];
export type GetSessionResponse = components['schemas']['GetSessionResponseDto_Output'];
export type ContinueSessionResponse = components['schemas']['ContinueSessionResponseDto_Output'];
export type DeleteSessionResponse = components['schemas']['DeleteSessionResponseDto_Output'];
export type SubmitFeedbackResponse = components['schemas']['SubmitFeedbackResponseDto_Output'];
export type UpdateCurrentBlockIndexResponse = components['schemas']['UpdateCurrentBlockIndexResponseDto_Output'];
