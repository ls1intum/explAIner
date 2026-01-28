import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateInformBlockDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  explanation: string;

  @IsOptional()
  @IsArray()
  examples?: string[];
}
