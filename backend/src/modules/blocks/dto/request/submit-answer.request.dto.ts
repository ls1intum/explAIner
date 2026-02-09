import { IsArray, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitAnswerRequestDto {
  @ApiProperty({ 
    description: 'Array of selected answer option indices (0-based)',
    type: [Number],
    example: [0, 2]
  })
  @IsArray()
  @IsInt({ each: true })
  studentAnswerOptionIndices: number[];
}
