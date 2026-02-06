import { Injectable } from '@nestjs/common';
import { AiService } from '../ai.service';
import { LearningGoalsParser } from '../parsers/learning-goals.parser';
import type { LearningGoalsArray } from '../../../common/types/learning-goals.types';

/**
 * Unified chain for generating learning goals (both normal and easier variants)
 * Orchestrates: Prompt -> AI Call -> Parse -> Validate
 */
@Injectable()
export class GenerateLearningGoalsChain {
  private parser = new LearningGoalsParser();

  constructor(private aiService: AiService) {}

  /**
   * Execute the chain with a custom prompt
   * @param prompt - The actual prompt string
   * @param promptFileName - The prompt file name for logging
   */
  async execute(
    prompt: string,
    promptFileName: string,
  ): Promise<LearningGoalsArray> {
    // 1. Call Claude with provided prompt
    const rawResponse = await this.aiService.callClaude(
      prompt,
      promptFileName,
    );

    // 2. Parse and validate response
    const learningGoals = this.parser.parse(rawResponse);

    return learningGoals;
  }
}
