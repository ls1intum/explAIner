import { Injectable, Logger } from '@nestjs/common';
import { LlmService } from '../llm.service';
import { Parser } from '../llm.parser';
import { generateEasierLearningGoalsPrompt } from '../prompts/generate-easier-learning-goals.prompt';
import {
  LearningGoalsSchema,
  type LearningGoals,
} from '../../../../domain/schemas/learning-goals/learning-goals.schema';
import { isLogEnabled } from '../../../../config/logging.config';

/**
 * Chain for generating easier learning goals. Orchestrates: Prompt -> LLM Call -> Parse -> Validate
 */
@Injectable()
export class GenerateEasierLearningGoalsChain {
  private readonly logger = new Logger('AI-CHAIN');
  private parser: Parser<LearningGoals>;

  constructor(private llmService: LlmService) {
    this.parser = new Parser(LearningGoalsSchema, async (error: string) => {
      const fixPrompt = `Your previous response failed validation with this error: ${error}. Please return a valid JSON response matching the required format.`;
      return this.llmService.callClaude(fixPrompt);
    });
  }

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
  }): Promise<LearningGoals> {
    // Log chain execution
    if (isLogEnabled('ai')) {
      this.logger.log('generate-easier-learning-goals');
    }

    // 1. Generate prompt
    const prompt = generateEasierLearningGoalsPrompt({
      topic: params.topic,
      originalGoal: params.originalGoal,
      originalBloomsLevel: params.originalBloomsLevel,
      wrongQuestions: params.wrongQuestions,
      coveredContent: params.coveredContent,
    });

    // 2. Call LLM with generated prompt
    const rawResponse = await this.llmService.callClaude(prompt);

    // 3. Parse and validate response (with retry on schema/parse failure)
    const learningGoals = await this.parser.parseWithRetry(rawResponse);

    return learningGoals;
  }
}
