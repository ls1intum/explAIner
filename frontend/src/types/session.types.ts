import { BlockType } from "./enums";

// Session, SessionWithBlocks

export interface Session {
  id: string;
  userId?: string;
  topic: string;
  learningGoalId: string;
  status: "active" | "completed" | "abandoned";
  startedAt: Date;
  completedAt?: Date;
  currentBlockIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionWithBlocks extends Session {
  blocks: Block[];
  learningGoal: LearningGoal;
}

export interface Block {
  id: string;
  sessionId: string;
  type: BlockType;
  order: number;
  content: unknown;
  createdAt: Date;
  updatedAt: Date;
}

export interface LearningGoal {
  id: string;
  name: string;
  description: string;
  bloomsLevel: string;
  soloLevel: string;
}
