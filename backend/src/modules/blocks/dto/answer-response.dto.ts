export class AnswerResponseDto {
  isCorrect: boolean;
  correctAnswerIndices: number[];
  explanation?: string;
}
