import { Injectable, Logger } from '@nestjs/common';
import { LlmService } from '../llm.service';
import { generateEasierLearningGoalsPrompt } from '../prompts/generate-easier-learning-goals.prompt';
import { LearningGoalsSchema, type LearningGoals } from '../../../../domain/schemas/base/learning-goal.schema';
import { isLogEnabled } from '../../../../config/logging.config';

/** Chain generating 3 easier learning goals for a new session based on previous session content & wrong answers to previous practice questions */
@Injectable()
export class GenerateEasierLearningGoalsChain {
  private readonly logger = new Logger('AI-CHAIN');

  constructor(private llmService: LlmService) {}

  async execute(params: {
    topic: string;
    originalGoal: string;
    originalBloomsLevel: string;
    wrongQuestions?: string[];
    coveredContent?: string;
  }): Promise<LearningGoals> {
    if (isLogEnabled('ai-chain')) {
      this.logger.log('generate-easier-learning-goals');
    }

    // Generate prompt
    const prompt = generateEasierLearningGoalsPrompt({
      topic: params.topic,
      originalGoal: params.originalGoal,
      originalBloomsLevel: params.originalBloomsLevel,
      wrongQuestions: params.wrongQuestions,
      coveredContent: params.coveredContent,
    });

    // Call LLM with prompt
    const llmResponse = await this.llmService.callClaude(prompt);

    // Parse LLM output against schema and return response
    return this.llmService.createParser(LearningGoalsSchema).parse(llmResponse);
  }
}
