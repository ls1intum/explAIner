import { Injectable } from '@nestjs/common';

@Injectable()
export class GenerateLearningGoalsService {
  /**
   * Generate 3 learning goals for a given topic
   */
  async generate(topic: string) {
    // Implementation using prompt, chain, and parser
    return { goals: [] };
  }
}
