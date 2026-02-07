import { ApiProperty } from '@nestjs/swagger';
import { GetBlockResponseDto } from '../../blocks/dto/get-block-by-order-index.response.dto';

class SessionInfoDto {
  @ApiProperty({ description: 'Unique session identifier' })
  id: string;

  @ApiProperty({ description: 'Learning topic or question' })
  topic: string;

  @ApiProperty({ description: 'Learning goal following the format "After this session, you will be able to <BloomsLevel> <objective>."' })
  learningGoal: string; 

  @ApiProperty({ description: 'Bloom\'s taxonomy level' })
  bloomsLevel: string;

  @ApiProperty({ description: 'Total number of sessions blocks (increases by 4 for each new block sequence)' })
  totalBlocks: number;

  @ApiProperty({ description: 'Block index (0-based) of currently / last viewed block by the user' })
  currentBlockIndex: number;
}

export class CreateSessionResponseDto {
  @ApiProperty({ description: 'Session information', type: SessionInfoDto })
  session: SessionInfoDto;

  @ApiProperty({ description: 'Initial block sequence (1 inform + 3 practice)', type: [GetBlockResponseDto] })
  blocks: GetBlockResponseDto[];
}
