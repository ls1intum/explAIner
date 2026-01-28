import { IsOptional, IsInt } from 'class-validator';

export class UpdateSessionDto {
  @IsOptional()
  @IsInt()
  currentBlockIndex?: number;
}
