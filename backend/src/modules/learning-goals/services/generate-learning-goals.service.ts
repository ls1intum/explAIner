import { Injectable } from '@nestjs/common';
import { GenerateLearningGoalsRequestDto } from '../dto/request/generate-learning-goals.request.dto';
import { GenerateLearningGoalsResponseDto } from '../dto/response/generate-learning-goals.response.dto';
import { GenerateLearningGoalsChain } from '../../ai/chains/generate-learning-goals.chain';
import { generateLearningGoalsPrompt } from '../../ai/prompts/generate-learning-goals.prompt';
import { LogService } from '../../../common/decorators/service-logging.decorator';

@Injectable()
export class GenerateLearningGoalsService {
  constructor(
    private generateLearningGoalsChain: GenerateLearningGoalsChain,
  ) {}

  @LogService()
  async generate(
    dto: GenerateLearningGoalsRequestDto,
  ): Promise<GenerateLearningGoalsResponseDto> {
    // Generate prompt
    const prompt = generateLearningGoalsPrompt({
      topic: dto.topic,
      priorKnowledgeKeywords: dto.priorKnowledgeKeywords,
    });

    // Call chain to generate learning goals
    const goals = await this.generateLearningGoalsChain.execute(
      prompt,
      'generate-learning-goals.prompt.ts',
    );

    // Return wrapped response
    return {
      learningGoals: goals.map((goal) => ({
        learningGoal: goal.learningGoal,
        bloomsLevel: goal.bloomsLevel as any,
      })),
    };
  }
}
