import { Injectable } from '@nestjs/common';
import { AiService } from '../ai.service';
import { LearningGoalsParser } from '../parsers/learning-goals.parser';
import { generateLearningGoalsPrompt } from '../prompts/generate-learning-goals.prompt';
import type { LearningGoalsArray } from '../../../common/types/learning-goals.types';

/**
 * Chain for generating learning goals
 * Orchestrates: Prompt -> AI Call -> Parse -> Validate
 */
@Injectable()
export class GenerateLearningGoalsChain {
  private parser = new LearningGoalsParser();

  constructor(private aiService: AiService) {}

  async execute(
    topic: string,
    priorKnowledge?: string,
  ): Promise<LearningGoalsArray> {
    // 1. Generate prompt
    const prompt = generateLearningGoalsPrompt({ topic, priorKnowledge });

    // 2. Call Claude
    const rawResponse = await this.aiService.callClaude(
      prompt,
      'generate-learning-goals.prompt.ts',
    );

    // 3. Parse and validate response
    const learningGoals = this.parser.parse(rawResponse);

    return learningGoals;
  }
}
