import { Injectable } from '@nestjs/common';
import { AiService } from '../ai.service';
import { LearningGoalsParser } from '../parsers/learning-goals.parser';
import type { LearningGoalsArray } from '../../../common/types/learning-goals.types';

/**
 * Chain for generating easier learning goals
 * Orchestrates: Prompt -> AI Call -> Parse -> Validate
 */
@Injectable()
export class GenerateEasierLearningGoalsChain {
  private parser = new LearningGoalsParser();

  constructor(private aiService: AiService) {}

  /**
   * Execute the chain with the easier learning goals prompt
   * @param prompt - The actual prompt string
   */
  async execute(prompt: string): Promise<LearningGoalsArray> {
    // 1. Call Claude with provided prompt
    const rawResponse = await this.aiService.callClaude(
      prompt,
      'generate-easier-learning-goals.prompt.ts',
    );

    // 2. Parse and validate response
    const learningGoals = this.parser.parse(rawResponse);

    return learningGoals;
  }
}
