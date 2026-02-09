import { ApiProperty } from '@nestjs/swagger';

export class InformBlockMessageDto {
  @ApiProperty({ description: 'Message ID' })
  id: string;

  @ApiProperty({ description: 'Block ID this message belongs to' })
  blockId: string;

  @ApiProperty({ description: 'Message content' })
  message: string;

  @ApiProperty({ description: 'Message sender', enum: ['User', 'Owlbert'] })
  sender: 'User' | 'Owlbert';

  @ApiProperty({ description: 'Message timestamp' })
  timestamp: Date;
}

export class PracticeBlockDto {
  @ApiProperty({ description: 'Block ID' })
  blockId: string;

  @ApiProperty({ description: 'SOLO taxonomy level' })
  soloLevel: string;

  @ApiProperty({ description: 'Practice question' })
  question: string;

  @ApiProperty({ description: 'Available answer options', type: [String] })
  answerOptions: string[];

  @ApiProperty({ description: 'Indices of correct answer options', type: [Number] })
  correctAnswerOptionIndices: number[];

  @ApiProperty({ description: 'Indices of student\'s selected answer options', type: [Number] })
  studentAnswerOptionIndices: number[];

  @ApiProperty({ description: 'Whether the student\'s answer is correct (null if not yet answered)', nullable: true })
  studentAnswerIsCorrect: boolean | null;
}

export class SummaryBlockDto {
  @ApiProperty({ description: 'Block ID' })
  blockId: string;

  @ApiProperty({ description: 'Session summary content' })
  sessionSummary: string;
}

export class GetBlockResponseDto {
  @ApiProperty({ description: 'Block ID' })
  id: string;

  @ApiProperty({ description: 'Session ID this block belongs to' })
  sessionId: string;

  @ApiProperty({ description: 'Order index of the block (0-based)' })
  orderIndex: number;

  @ApiProperty({ description: 'Whether the block has been viewed by the user already' })
  alreadyViewed: boolean;

  @ApiProperty({ description: 'Block type', enum: ['Inform', 'Practice', 'Summary'] })
  type: string;

  @ApiProperty({ description: 'Inform block messages (only for Inform blocks)', type: [InformBlockMessageDto], required: false })
  informBlockMessages?: InformBlockMessageDto[];

  @ApiProperty({ description: 'Practice block data (only for Practice blocks)', type: PracticeBlockDto, required: false })
  practiceBlock?: PracticeBlockDto;

  @ApiProperty({ description: 'Summary block data (only for Summary blocks)', type: SummaryBlockDto, required: false })
  summaryBlock?: SummaryBlockDto;
}
