import { Injectable } from '@nestjs/common';
import { GenerateEasierLearningGoalsDto } from '../dto/generate-easier-learning-goals.dto';
import { LearningGoalResponseDto } from '../dto/learning-goal-response.dto';

@Injectable()
export class GenerateEasierLearningGoalsService {
  async generate(dto: GenerateEasierLearningGoalsDto): Promise<LearningGoalResponseDto[]> {
    // Implementation:
    // 1. Use AI service: generate-easier-learning-goals.service.ts from ai module
    // 2. Parse response and return as array of LearningGoalResponseDto
    return [];
  }
}
