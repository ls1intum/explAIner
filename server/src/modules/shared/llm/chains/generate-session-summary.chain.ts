import { Injectable, Logger } from '@nestjs/common';
import { isLogEnabled } from '../../../../config/logging.config';
import { LlmService } from '../llm.service';
import { generateSessionSummaryPrompt } from '../prompts/generate-session-summary.prompt';
import {
  SessionSummaryParserSchema,
  type SessionSummaryParser,
} from '../../../../domain/schemas/llm-parser/block.schema';

/** Chain generating the session summary text that is displayed on summary block */
@Injectable()
export class GenerateSessionSummaryChain {
  private readonly logger = new Logger('AI-CHAIN');

  constructor(private llmService: LlmService) {}

  async execute(params: {
    topic: string;
    learningGoal: string;
    bloomsLevel: string;
    informContent: string[];
    practiceResults: Array<{ question: string; isCorrect: boolean }>;
    lang?: string | null;
  }): Promise<SessionSummaryParser> {
    if (isLogEnabled('ai-chain')) {
      this.logger.log('generate-session-summary');
    }

    // Generate prompt
    const prompt = generateSessionSummaryPrompt({
      topic: params.topic,
      learningGoal: params.learningGoal,
      bloomsLevel: params.bloomsLevel,
      informContent: params.informContent,
      practiceResults: params.practiceResults,
      lang: params.lang,
    });

    // Call LLM with prompt
    const llmResponse = await this.llmService.callClaude(prompt);

    // Parse LLM output against schema and return response
    return this.llmService.createParser(SessionSummaryParserSchema).parse(llmResponse);
  }
}
