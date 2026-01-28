import { IsInt, IsBoolean, IsArray, Min } from 'class-validator';

export class CreateSummaryBlockDto {
  @IsInt()
  @Min(0)
  sessionDuration: number;

  @IsInt()
  @Min(0)
  blocksCompleted: number;

  @IsInt()
  @Min(0)
  score: number;

  @IsBoolean()
  learningGoalAchieved: boolean;

  @IsArray()
  keyTakeaways: string[];
}
