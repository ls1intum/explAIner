import { IsString, IsOptional } from 'class-validator';

export class GenerateLearningGoalsRequestDto {
  @IsString()
  topic: string;

  @IsOptional()
  @IsString()
  priorKnowledgeKeywords?: string;
}
