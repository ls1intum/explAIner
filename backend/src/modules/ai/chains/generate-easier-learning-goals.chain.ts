import { Injectable } from '@nestjs/common';
import { AiService } from '../ai.service';
import { Parser } from '../parser/parser';
import { generateEasierLearningGoalsPrompt } from '../prompts/generate-easier-learning-goals.prompt';
import { learningGoalsSchema } from '../schemas/learning-goals.schema';
import type { LearningGoalsArray } from '../../../common/types/learning-goals.types';
import { logAiChain } from '../../../common/utils/logging.utils';
import { isLogEnabled } from '../../../common/config/logging.config';

/**
 * Chain for generating easier learning goals
 * Orchestrates: Prompt -> AI Call -> Parse -> Validate
 */
@Injectable()
export class GenerateEasierLearningGoalsChain {
  private parser = new Parser(learningGoalsSchema);

  constructor(private aiService: AiService) {}

  /**
   * Execute the chain with structured parameters
   * @param params - Structured input parameters for generating easier learning goals
   */
  async execute(params: {
    topic: string;
    originalGoal: string;
    originalBloomsLevel: string;
    wrongQuestions?: string[];
    coveredContent?: string;
  }): Promise<LearningGoalsArray> {
    // Log chain execution
    if (isLogEnabled('ai')) {
      logAiChain('generate-easier-learning-goals');
    }

    // 1. Generate prompt from template
    const prompt = generateEasierLearningGoalsPrompt({
      topic: params.topic,
      originalGoal: params.originalGoal,
      originalBloomsLevel: params.originalBloomsLevel,
      wrongQuestions: params.wrongQuestions,
      coveredContent: params.coveredContent,
    });

    // 2. Call Claude with generated prompt
    const rawResponse = await this.aiService.callClaude(prompt);

    // 3. Parse and validate response
    const learningGoals = this.parser.parse(rawResponse);

    return learningGoals;
  }
}
