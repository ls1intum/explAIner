import { IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitFeedbackRequestDto {
  @ApiProperty({ 
    description: 'User rating for the session (1-5 stars) - 1: "very unhelpful", 5: "very helpful"',
    minimum: 1,
    maximum: 5,
    example: 4
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}
