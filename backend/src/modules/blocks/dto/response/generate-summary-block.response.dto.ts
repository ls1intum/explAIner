import { ApiProperty } from '@nestjs/swagger';
import { GetBlockResponseDto } from './get-block-by-order-index.response.dto';

export class SessionInfoDto {
  @ApiProperty({ description: 'Learning goal for the session' })
  learningGoal: string;

  @ApiProperty({ description: 'Bloom\'s taxonomy level' })
  bloomsLevel: string;

  @ApiProperty({ description: 'Total number of blocks in the session' })
  totalBlocks: number;

  @ApiProperty({ description: 'Session duration in minutes' })
  sessionDuration: number;
}

export class GenerateSummaryBlockResponseDto {
  @ApiProperty({ description: 'Generated summary block', type: GetBlockResponseDto })
  block: GetBlockResponseDto;

  @ApiProperty({ description: 'Session information for the summary', type: SessionInfoDto })
  sessionInfo: SessionInfoDto;
}
