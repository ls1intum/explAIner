import { Injectable } from '@nestjs/common';
import { AiService } from '../ai.service';
import { Parser } from '../ai.parser';
import { generateLearningGoalsPrompt } from '../prompts/generate-learning-goals.prompt';
import { learningGoalsSchema } from '../schemas/learning-goals.schema';
import type { LearningGoalsArray } from '../../../common/types/learning-goals.types';
import { logAiChain } from '../../../common/utils/logging.utils';
import { isLogEnabled } from '../../../common/config/logging.config';

/**
 * Chain for generating learning goals
 * Orchestrates: Prompt -> AI Call -> Parse -> Validate
 */
@Injectable()
export class GenerateLearningGoalsChain {
  private parser = new Parser(learningGoalsSchema);

  constructor(private aiService: AiService) {}

  /**
   * Execute the chain with structured parameters
   * @param params - Structured input parameters for generating learning goals
   */
  async execute(params: {
    topic: string;
    priorKnowledgeKeywords?: string;
  }): Promise<LearningGoalsArray> {
    // Log chain execution
    if (isLogEnabled('ai')) {
      logAiChain('generate-learning-goals');
    }

    // 1. Generate prompt from template
    const prompt = generateLearningGoalsPrompt({
      topic: params.topic,
      priorKnowledgeKeywords: params.priorKnowledgeKeywords,
    });

    // 2. Call Claude with generated prompt
    const rawResponse = await this.aiService.callClaude(prompt);

    // 3. Parse and validate response
    const learningGoals = this.parser.parse(rawResponse);

    return learningGoals;
  }
}
