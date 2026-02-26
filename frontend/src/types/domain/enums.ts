/**
 * Domain Enums
 * 
 * Type aliases and constants for enum-like values from the API.
 * These are derived from the generated OpenAPI types.
 */

import type { components } from '../generated/api.types';

// Extract the block type from the get-block response (same as Block['type'])
export type BlockType = components['schemas']['GetBlockResponseDto_Output']['data']['type'];

// BlockType constants for convenience (matches API values exactly)
export const BlockType = {
  INFORM: "Inform" as const,
  PRACTICE: "Practice" as const,
  SUMMARY: "Summary" as const,
} as const;
