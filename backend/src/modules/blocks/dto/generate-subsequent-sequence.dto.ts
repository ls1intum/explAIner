import { IsString, IsArray, IsOptional } from 'class-validator';

export class GenerateSubsequentSequenceDto {
  @IsString()
  sessionId: string;

  @IsOptional()
  @IsString()
  mistakeAnalysis?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  existingQuestions?: string[];
}
