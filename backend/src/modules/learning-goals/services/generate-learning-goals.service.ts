import { Injectable } from '@nestjs/common';
import { GenerateLearningGoalsRequestDto } from '../dto/request/generate-learning-goals.request.dto';
import { GenerateLearningGoalsResponseDto } from '../dto/response/generate-learning-goals.response.dto';
import { GenerateLearningGoalsChain } from '../../ai/llm/chains/generate-learning-goals.chain';
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
    // Call chain with structured params (chain handles prompt generation)
    const goals = await this.generateLearningGoalsChain.execute({
      topic: dto.topic,
      priorKnowledgeKeywords: dto.priorKnowledgeKeywords,
    });

    // Return wrapped response (chain already returns correct tuple structure)
    return {
      learningGoals: goals,
    };
  }
}
