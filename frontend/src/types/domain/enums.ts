/**
 * Domain Enums
 * 
 * Type aliases and constants for enum-like values from the API.
 * These are derived from the generated OpenAPI types.
 */

import type { components } from '../generated';

// Extract the block type from the GetBlockResponseDto
export type BlockType = components['schemas']['GetBlockResponseDto']['type'];

// BlockType constants for convenience (matches API values exactly)
export const BlockType = {
  INFORM: "Inform" as const,
  PRACTICE: "Practice" as const,
  SUMMARY: "Summary" as const,
} as const;
