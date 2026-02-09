import { ApiProperty } from '@nestjs/swagger';

export class SubmitFeedbackResponseDto {
  @ApiProperty({ description: 'Whether the feedback was successfully submitted' })
  success: boolean;

  @ApiProperty({ description: 'The submitted rating (1-5) - 1: "very unhelpful", 5: "very helpful"' })
  rating: number;
}
