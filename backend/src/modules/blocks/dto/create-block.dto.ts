import { IsString, IsEnum, IsInt, IsObject } from 'class-validator';
import { BlockType } from '../../../common/types/block-type.enum';

export class CreateBlockDto {
  @IsString()
  sessionId: string;

  @IsEnum(BlockType)
  type: BlockType;

  @IsInt()
  order: number;

  @IsObject()
  content: any;
}
