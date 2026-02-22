import { Injectable, Logger } from '@nestjs/common';
import { LlmService } from '../llm.service';
import { generateLearningGoalsPrompt } from '../prompts/generate-learning-goals.prompt';
import { LearningGoalsSchema, type LearningGoals } from '../../../../domain/schemas/base/learning-goal.schema';
import { isLogEnabled } from '../../../../config/logging.config';

/** Chain generating 3 learning goals based on a topic and (optional) prior knowledge */
@Injectable()
export class GenerateLearningGoalsChain {
  private readonly logger = new Logger('AI-CHAIN');

  constructor(private llmService: LlmService) {}

  async execute(params: {
    topic: string;
    priorKnowledge?: string;
  }): Promise<LearningGoals> {
    if (isLogEnabled('ai-chain')) {
      this.logger.log('generate-learning-goals');
    }

    // Generate prompt
    const prompt = generateLearningGoalsPrompt({
      topic: params.topic,
      priorKnowledge: params.priorKnowledge,
    });

    // Call LLM with prompt
    const rawResponse = await this.llmService.callClaude(prompt);

    // Parse LLM output against schema and return response
    return this.llmService.createParser(LearningGoalsSchema).parseWithRetry(rawResponse);
  }
}
