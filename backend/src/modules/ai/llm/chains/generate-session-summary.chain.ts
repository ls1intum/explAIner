import { Injectable, Logger } from '@nestjs/common';
import { LlmService } from '../llm.service';
import { Parser } from '../llm.parser';
import { generateSessionSummaryPrompt } from '../prompts/generate-session-summary.prompt';
import {
  sessionSummaryParseSchema,
  type SessionSummaryParseSchema,
} from '../../../../domain/schemas/blocks/summary/summary-block.schema';
import { isLogEnabled } from '../../../../config/logging.config';

/**
 * Chain for generating session summary. Orchestrates: Prompt -> LLM Call -> Parse -> Validate
 */
@Injectable()
export class GenerateSessionSummaryChain {
  private readonly logger = new Logger('AI-CHAIN');
  private parser: Parser<SessionSummaryParseSchema>;

  constructor(private llmService: LlmService) {
    this.parser = new Parser(sessionSummaryParseSchema, async (error: string) => {
      const fixPrompt = `Your previous response failed validation with this error: ${error}. Please return a valid JSON response matching the required format.`;
      return this.llmService.callClaude(fixPrompt);
    });
  }

  async execute(params: {
    topic: string;
    learningGoal: string;
    bloomsLevel: string;
    informContent: string[];
    practiceResults: Array<{ question: string; isCorrect: boolean }>;
  }): Promise<SessionSummaryParseSchema> {
    if (isLogEnabled('ai')) {
      this.logger.log('generate-session-summary');
    }

    // 1. Generate prompt
    const prompt = generateSessionSummaryPrompt({
      topic: params.topic,
      learningGoal: params.learningGoal,
      bloomsLevel: params.bloomsLevel,
      informContent: params.informContent,
      practiceResults: params.practiceResults,
    });

    // 2. Call LLM with generated prompt
    const rawResponse = await this.llmService.callClaude(prompt);

    // 3. Parse and validate response (with retry on schema/parse failure)
    const sessionSummary = await this.parser.parseWithRetry(rawResponse);

    return sessionSummary;
  }
}
