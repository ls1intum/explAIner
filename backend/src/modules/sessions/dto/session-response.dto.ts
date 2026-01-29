export class SessionResponseDto {
  id: string;
  topic: string;
  learningGoalId: string;
  status: string;
  currentBlockIndex: number;
  createdAt: Date;
  updatedAt: Date;
}
