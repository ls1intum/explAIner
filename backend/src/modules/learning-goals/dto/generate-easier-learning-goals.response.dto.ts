import { LearningGoalDto } from './learning-goal.dto';

/**
 * Generate Easier Learning Goals Response DTO
 *
 * Returns a wrapped response with full context (topic, priorKnowledgeKeywords)
 * since the client only sends sessionId in the request.
 */
export class GenerateEasierLearningGoalsResponseDto {
  topic: string;
  priorKnowledgeKeywords: string;
  learningGoals: LearningGoalDto[];
}
