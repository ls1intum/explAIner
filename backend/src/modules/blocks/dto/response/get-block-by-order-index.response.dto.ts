import type { Block } from '../../../../domain/schemas/blocks/block.schema';

/** Response body: single block by order index (discriminated union of block types). */
export type GetBlockResponseDto = Block;

