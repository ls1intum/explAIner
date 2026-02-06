import { GetBlockResponseDto } from './get-block-by-order-index.response.dto';

export class GenerateSummaryResponseDto {
  block: GetBlockResponseDto;
  sessionInfo: SessionInfoDto;
}

export class SessionInfoDto {
  learningGoal: string;
  bloomsLevel: string;
  totalBlocks: number;
  sessionDuration: number;
  allPracticeCorrect: boolean;
}
