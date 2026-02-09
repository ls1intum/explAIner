/**
 * Block Domain Types
 * 
 * Re-exports from generated API types for cleaner imports.
 * These types represent the API contract between frontend and backend.
 * 
 * Source: Generated from OpenAPI specification
 * To regenerate: npm run generate:api-types
 */

import type { components } from '../generated';

// Block-related types
export type Block = components['schemas']['GetBlockResponseDto'];
export type InformBlockMessage = components['schemas']['InformBlockMessageDto'];
export type PracticeBlock = components['schemas']['PracticeBlockDto'];
export type SummaryBlock = components['schemas']['SummaryBlockDto'];
export type GenerateBlockSequenceResponse = components['schemas']['GenerateBlockSequenceResponseDto'];
export type GenerateSummaryResponse = components['schemas']['GenerateSummaryResponseDto'];
export type SendMessageResponse = components['schemas']['SendMessageResponseDto'];
