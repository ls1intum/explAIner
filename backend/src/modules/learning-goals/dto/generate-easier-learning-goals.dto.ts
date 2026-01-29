import { IsString, IsOptional, IsArray } from 'class-validator';

export class GenerateEasierLearningGoalsDto {
  @IsString()
  topic: string;

  @IsString()
  originalGoal: string;

  @IsString()
  originalBloomsLevel: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  wrongQuestions?: string[];

  @IsOptional()
  @IsString()
  coveredContent?: string;
}
