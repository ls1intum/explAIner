import { BlockType } from "./enums";

// Session types

export interface Session {
  id: string;
  topic: string;
  learningGoal: string;
  bloomsLevel: string;
  totalBlocks: number;
  currentBlockIndex: number;
}

export interface Block {
  id: string;
  sessionId: string;
  orderIndex: number;
  alreadyViewed: boolean;
  type: BlockType;
  informBlockMessages?: InformBlockMessage[];
  practiceBlock?: PracticeBlock;
  summaryBlock?: SummaryBlock;
}

export interface InformBlockMessage {
  id: string;
  blockId: string;
  message: string;
  sender: "User" | "Owlbert";
  timestamp: Date;
}

export interface PracticeBlock {
  blockId: string;
  soloLevel: string;
  question: string;
  answerOptions: string[];
  correctAnswerOptionIndices: number[];
  studentAnswerOptionIndices: number[];
  studentAnswerIsCorrect: boolean | null;
}

export interface SummaryBlock {
  blockId: string;
  sessionSummary: string;
}

export interface CreateSessionRequest {
  topic: string;
  learningGoal: string;
  bloomsLevel: string;
  priorKnowledge?: string;
}

export interface CreateSessionResponse {
  session: Session;
  blocks: Block[];
}

export interface ContinueSessionResponse {
  action: 'navigate' | 'next-sequence' | 'summary' | 'prompt-user';
  nextOrderIndex?: number;
}
