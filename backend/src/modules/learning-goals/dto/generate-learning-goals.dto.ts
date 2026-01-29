import { IsString, IsOptional, IsArray } from 'class-validator';

export class GenerateLearningGoalsDto {
  @IsString()
  topic: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];
}
