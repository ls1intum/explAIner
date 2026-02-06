import { IsInt, Min } from 'class-validator';

export class UpdateCurrentBlockIndexRequestDto {
  @IsInt()
  @Min(0)
  currentBlockIndex: number;
}
