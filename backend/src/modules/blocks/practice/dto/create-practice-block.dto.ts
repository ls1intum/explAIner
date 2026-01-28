import { IsString, IsArray, IsInt, Min, Max } from 'class-validator';

export class CreatePracticeBlockDto {
  @IsString()
  question: string;

  @IsArray()
  options: any[];

  @IsString()
  correctAnswerId: string;

  @IsString()
  explanation: string;

  @IsInt()
  @Min(1)
  @Max(5)
  difficulty: number;
}
