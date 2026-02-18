import { Injectable } from '@nestjs/common';
import { LlmService } from '../llm.service';
import { Parser } from '../llm.parser';
import { generateSessionSummaryPrompt } from '../prompts/generate-session-summary.prompt';
import {
  sessionSummarySchema,
  type SessionSummary,
} from '../../../../domain/schemas/blocks/summary/summary-block.schema';
import { logAiChain } from '../../../../common/utils/logging.utils';
import { isLogEnabled } from '../../../../config/logging.config';

/**
 * Chain for generating session summary. Orchestrates: Prompt -> LLM Call -> Parse -> Validate
 */
@Injectable()
export class GenerateSessionSummaryChain {
  private parser: Parser<SessionSummary>;

  constructor(private llmService: LlmService) {
    this.parser = new Parser(sessionSummarySchema, async (error: string) => {
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
  }): Promise<SessionSummary> {
    if (isLogEnabled('ai')) {
      logAiChain('generate-session-summary');
    }

    // 1. Generate prompt
    const prompt = generateSessionSummaryPrompt({
      topic: params.topic,
      learningGoal: params.learningGoal,
      bloomsLevel: params.bloomsLevel,
      informContent: params.informContent,
      practiceResults: params.practiceResults,
    });

    // 2. Call Claude
    const rawResponse = await this.llmService.callClaude(prompt);

    // 3. Parse and validate response (with retry on schema/parse failure)
    const sessionSummary = await this.parser.parseWithRetry(rawResponse);

    return sessionSummary;
  }
}
