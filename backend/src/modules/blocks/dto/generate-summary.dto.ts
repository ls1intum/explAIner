import { IsString } from 'class-validator';

export class GenerateSummaryDto {
  @IsString()
  sessionId: string;
}
