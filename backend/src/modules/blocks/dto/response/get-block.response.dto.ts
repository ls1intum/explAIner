import type { Block } from '../../../../domain/schemas/base/blocks/block.schema';

/** Response body returning a single (inform / practice / summary) block by order index */
export type GetBlockResponseDto = Block;
