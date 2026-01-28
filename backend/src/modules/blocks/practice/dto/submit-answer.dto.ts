import { IsString, IsInt, Min } from 'class-validator';

export class SubmitAnswerDto {
  @IsString()
  answerId: string;

  @IsInt()
  @Min(0)
  timeSpent: number;
}
