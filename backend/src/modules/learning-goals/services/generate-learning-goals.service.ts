import { Injectable } from '@nestjs/common';
import { GenerateLearningGoalsDto } from '../dto/generate-learning-goals.dto';
import { LearningGoalResponseDto } from '../dto/learning-goal-response.dto';
import { GenerateLearningGoalsService as AiGenerateLearningGoalsService } from '../../ai/services/generate-learning-goals.service';

@Injectable()
export class GenerateLearningGoalsService {
  constructor(
    private aiGenerateLearningGoalsService: AiGenerateLearningGoalsService,
  ) {}

  async generate(
    dto: GenerateLearningGoalsDto,
  ): Promise<LearningGoalResponseDto[]> {
    // Call AI service to generate learning goals
    const goals = await this.aiGenerateLearningGoalsService.generate(
      dto.topic,
      dto.keywords,
    );

    // Map to response DTOs
    return goals.map((goal) => ({
      learningGoal: goal.learningGoal,
      bloomsLevel: goal.bloomsLevel as any,
    }));
  }
}
