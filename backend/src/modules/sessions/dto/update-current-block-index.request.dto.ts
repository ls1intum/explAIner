import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCurrentBlockIndexRequestDto {
  @ApiProperty({ 
    description: 'The index of the current block being viewed (0-based) by the user',
    minimum: 0,
    example: 2
  })
  @IsInt()
  @Min(0)
  currentBlockIndex: number;
}
