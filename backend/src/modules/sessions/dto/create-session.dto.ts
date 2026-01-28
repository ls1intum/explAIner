import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  topic: string;

  @IsString()
  learningGoalId: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];
}
