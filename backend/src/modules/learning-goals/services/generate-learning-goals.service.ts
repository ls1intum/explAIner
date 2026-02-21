import { Injectable } from '@nestjs/common';
import { GenerateLearningGoalsRequestDto } from '../dto/request/generate-learning-goals.request.dto';
import { GenerateLearningGoalsResponseDto } from '../dto/response/generate-learning-goals.response.dto';
import { GenerateLearningGoalsChain } from '../../ai/llm/chains/generate-learning-goals.chain';
import { LogService } from '../../../common/decorators/service-logging.decorator';

/** Generates 3 learning goal suggestions based on topic and (optional) prior knowledge */
@Injectable()
export class GenerateLearningGoalsService {
  constructor(
    private generateLearningGoalsChain: GenerateLearningGoalsChain,
  ) {}

  @LogService()
  async generate(
    dto: GenerateLearningGoalsRequestDto,
  ): Promise<GenerateLearningGoalsResponseDto> {
    
    // Call chain
    const goals = await this.generateLearningGoalsChain.execute({
      topic: dto.topic,
      priorKnowledge: dto.priorKnowledge,
    });

    // Return response
    return { learningGoals: goals };
  }
}
