import { IsString, IsOptional } from 'class-validator';

export class GenerateLearningGoalsDto {
  @IsString()
  topic: string;

  @IsOptional()
  @IsString()
  keywords?: string;
}
