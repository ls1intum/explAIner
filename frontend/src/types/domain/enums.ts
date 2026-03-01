/**
 * Domain Enums
 *
 * Generated from OpenAPI specification, re-exported here for client-side usage with cleaner imports
 * For further details, see ../README.md (client/src/types/README.md)
 */

import type { components } from '../generated/api.types';

export type BlockType = components['schemas']['GetBlockResponseDto_Output']['data']['type'];
export type BloomsLevel = components['schemas']['CreateSessionRequestDto']['learningGoal']['bloomsLevel'];

// Object to simplify comparisons - e.g.: block.type === BLOCK_TYPE.INFORM
export const BLOCK_TYPE = {
  INFORM: 'Inform',
  PRACTICE: 'Practice',
  SUMMARY: 'Summary',
} as const satisfies Record<string, BlockType>;

// Array to simplify iterations - e.g.: BLOOMS_LEVELS.map((level) => (...)))
export const BLOOMS_LEVELS: BloomsLevel[] = [
  'Remember',
  'Understand',
  'Apply',
  'Analyze',
  'Evaluate',
  'Create',
];
