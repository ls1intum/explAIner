import { GetBlockResponseDto } from './get-block-by-order-index.response.dto';

export class GenerateBlockSequenceResponseDto {
  informBlock: GetBlockResponseDto;
  practiceBlocks: GetBlockResponseDto[];
}
