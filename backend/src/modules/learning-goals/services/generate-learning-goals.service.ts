import { Injectable } from '@nestjs/common';
import { GenerateLearningGoalsDto } from '../dto/generate-learning-goals.dto';
import { LearningGoalResponseDto } from '../dto/learning-goal-response.dto';

@Injectable()
export class GenerateLearningGoalsService {
  async generate(dto: GenerateLearningGoalsDto): Promise<LearningGoalResponseDto[]> {
    // Implementation:
    // 1. Use AI service: generate-learning-goals.service.ts from ai module
    // 2. Parse response and return as array of LearningGoalResponseDto
    return [];
  }
}
