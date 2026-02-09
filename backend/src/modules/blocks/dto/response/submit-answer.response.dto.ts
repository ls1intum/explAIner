import { ApiProperty } from '@nestjs/swagger';

export class SubmitAnswerResponseDto {
  @ApiProperty({ description: 'Whether the student answer was successfully persisted' })
  success: boolean;

  @ApiProperty({ 
    description: 'Array of selected answer option indices (0-based)',
    type: [Number],
    example: [0, 2]
  })
  studentAnswerOptionIndices: number[];
}
