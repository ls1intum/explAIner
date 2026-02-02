import { Injectable } from '@nestjs/common';
import { GenerateLearningGoalsChain } from '../chains/generate-learning-goals.chain';
import type { LearningGoalsArray } from '../../../common/types/learning-goals.types';

@Injectable()
export class GenerateLearningGoalsService {
  constructor(private chain: GenerateLearningGoalsChain) {}

  /**
   * Generate 3 learning goals for a given topic using Claude
   */
  async generate(
    topic: string,
    priorKnowledge?: string,
  ): Promise<LearningGoalsArray> {
    return this.chain.execute(topic, priorKnowledge);
  }
}
