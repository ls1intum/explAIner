import { IsString } from 'class-validator';

export class SelectGoalDto {
  @IsString()
  goalId: string;
}
