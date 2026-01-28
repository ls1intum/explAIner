import { IsString } from 'class-validator';

export class FollowUpQuestionDto {
  @IsString()
  blockId: string;

  @IsString()
  question: string;
}
