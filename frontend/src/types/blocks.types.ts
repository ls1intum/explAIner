// InformBlock, PracticeBlock, SummaryBlock

export interface InformBlockContent {
  title: string;
  content: string;
  explanation: string;
  examples?: string[];
  visualizations?: Visualization[];
}

export interface Visualization {
  type: "image" | "diagram" | "code";
  url?: string;
  data?: unknown;
}

export interface PracticeBlockContent {
  question: string;
  options: AnswerOption[];
  correctAnswerId: string;
  explanation: string;
  difficulty: number;
}

export interface AnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface SummaryBlockContent {
  sessionDuration: number;
  blocksCompleted: number;
  score: number;
  learningGoalAchieved: boolean;
  keyTakeaways: string[];
}

export interface FeedbackSubmission {
  sessionId: string;
  rating: number;
  comment?: string;
}
