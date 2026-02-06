export class GetBlockResponseDto {
  id: string;
  sessionId: string;
  orderIndex: number;
  alreadyViewed: boolean;
  type: string;
  informBlockMessages?: InformBlockMessageDto[];
  practiceBlock?: PracticeBlockDto;
  summaryBlock?: SummaryBlockDto;
}

export class InformBlockMessageDto {
  id: string;
  blockId: string;
  message: string;
  sender: 'User' | 'Owlbert';
  timestamp: Date;
}

export class PracticeBlockDto {
  blockId: string;
  soloLevel: string;
  question: string;
  answerOptions: string[];
  correctAnswerOptionIndices: number[];
  studentAnswerOptionIndices: number[];
  studentAnswerIsCorrect: boolean | null;
}

export class SummaryBlockDto {
  blockId: string;
  sessionSummary: string;
}
