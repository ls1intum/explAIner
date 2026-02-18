import { Injectable, Logger } from '@nestjs/common';
import { LlmService } from '../llm.service';
import { Parser } from '../llm.parser';
import { generateLearningGoalsPrompt } from '../prompts/generate-learning-goals.prompt';
import {
  learningGoalsSchema,
  type LearningGoals,
} from '../../../../domain/schemas/learning-goals/learning-goals.schema';
import { isLogEnabled } from '../../../../config/logging.config';

/**
 * Chain for generating learning goals. Orchestrates: Prompt -> LLM Call -> Parse -> Validate
 */
@Injectable()
export class GenerateLearningGoalsChain {
  private readonly logger = new Logger('AI-CHAIN');
  private parser: Parser<LearningGoals>;

  constructor(private llmService: LlmService) {
    this.parser = new Parser(learningGoalsSchema, async (error: string) => {
      const fixPrompt = `Your previous response failed validation with this error: ${error}. Please return a valid JSON response matching the required format.`;
      return this.llmService.callClaude(fixPrompt);
    });
  }

  /**
   * Execute the chain with structured parameters
   * @param params - Structured input parameters for generating learning goals
   */
  async execute(params: {
    topic: string;
    priorKnowledgeKeywords?: string;
  }): Promise<LearningGoals> {
    // Log chain execution
    if (isLogEnabled('ai')) {
      this.logger.log('generate-learning-goals');
    }

    // 1. Generate prompt from template
    const prompt = generateLearningGoalsPrompt({
      topic: params.topic,
      priorKnowledgeKeywords: params.priorKnowledgeKeywords,
    });

    // 2. Call Claude with generated prompt
    const rawResponse = await this.llmService.callClaude(prompt);

    // 3. Parse and validate response (with retry on schema/parse failure)
    const learningGoals = await this.parser.parseWithRetry(rawResponse);

    return learningGoals;
  }
}
