import { IsArray, IsInt } from 'class-validator';

export class SubmitAnswerRequestDto {
  @IsArray()
  @IsInt({ each: true })
  student_answer_option_indices: number[];
}
