import { IsString } from 'class-validator';

export class GenerateEasierLearningGoalsRequestDto {
  @IsString()
  sessionId: string;
}
