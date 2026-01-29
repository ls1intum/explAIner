import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class ContinueSessionDto {
  @IsOptional()
  @IsString()
  action?: string; // 'next' | 'retry' | 'easier'

  @IsOptional()
  @IsBoolean()
  requestSummary?: boolean;
}
