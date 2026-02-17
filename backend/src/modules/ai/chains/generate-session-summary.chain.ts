import { Injectable } from '@nestjs/common';
import { LlmService } from '../llm.service';
import { Parser } from '../llm.parser';
import { generateSessionSummaryPrompt } from '../prompts/generate-session-summary.prompt';
import { sessionSummarySchema, type SessionSummary } from '../schemas/session-summary.schema';
import { logAiChain } from '../../../common/utils/logging.utils';
import { isLogEnabled } from '../../../common/config/logging.config';

/**
 * Chain for generating session summary
 * Orchestrates: Prompt -> AI Call -> Parse -> Validate
 */
@Injectable()
export class GenerateSessionSummaryChain {
  private parser = new Parser(sessionSummarySchema);

  constructor(private llmService: LlmService) {}

  async execute(params: {
    topic: string;
    learningGoal: string;
    bloomsLevel: string;
    informContent: string[];
    practiceResults: Array<{ question: string; isCorrect: boolean }>;
  }): Promise<SessionSummary> {
    // Log chain execution
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

    // 3. Parse and validate response
    const sessionSummary = this.parser.parse(rawResponse);

    return sessionSummary;
  }
}
