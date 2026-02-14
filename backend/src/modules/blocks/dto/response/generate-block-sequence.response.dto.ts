import { ApiProperty } from '@nestjs/swagger';
import { GetBlockResponseDto } from './get-block-by-order-index.response.dto';

/**
 * Generate Block Sequence Response DTO
 *
 * Wrapper DTO for block sequence generation response.
 * Note: Kept as class-based DTO since it references other DTOs.
 */
export class GenerateBlockSequenceResponseDto {
  @ApiProperty({ description: 'Generated inform block', type: GetBlockResponseDto })
  informBlock: GetBlockResponseDto;

  @ApiProperty({ description: 'Generated practice blocks (3 blocks)', type: [GetBlockResponseDto] })
  practiceBlocks: GetBlockResponseDto[];
}
