import { IsString, IsOptional, IsEnum } from 'class-validator';
import { BloomsLevel } from '@prisma/client';

export class CreateSessionRequestDto {
  @IsString()
  topic: string;

  @IsOptional()
  @IsString()
  priorKnowledgeKeywords?: string;

  @IsString()
  learningGoal: string;

  @IsEnum(BloomsLevel)
  bloomsLevel: BloomsLevel;
}
