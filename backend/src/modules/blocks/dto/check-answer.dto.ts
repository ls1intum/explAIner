import { IsInt, IsArray, Min } from 'class-validator';

export class CheckAnswerDto {
  @IsInt()
  @Min(0)
  questionIndex: number;

  @IsArray()
  @IsInt({ each: true })
  selectedAnswerIndices: number[];
}
