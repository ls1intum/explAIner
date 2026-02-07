import { ApiProperty } from '@nestjs/swagger';

export class UpdateCurrentBlockIndexResponseDto {
  @ApiProperty({ description: 'Whether the current block index was successfully updated' })
  success: boolean;

  @ApiProperty({ description: 'The updated current block index (0-based)' })
  currentBlockIndex: number;
}
