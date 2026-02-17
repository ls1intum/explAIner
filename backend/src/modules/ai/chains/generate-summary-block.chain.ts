import { Injectable } from '@nestjs/common';
import { LlmService } from '../llm.service';
import { Parser } from '../llm.parser';
import { generateSummaryBlockPrompt } from '../prompts/generate-summary-block.prompt';
import { summaryBlockSchema, type SummaryBlock } from '../schemas/summary-block.schema';
import { logAiChain } from '../../../common/utils/logging.utils';
import { isLogEnabled } from '../../../common/config/logging.config';

/**
 * Chain for generating summary block
 * Orchestrates: Prompt -> AI Call -> Parse -> Validate
 */
@Injectable()
export class GenerateSummaryBlockChain {
  private parser = new Parser(summaryBlockSchema);

  constructor(private llmService: LlmService) {}

  async execute(params: {
    topic: string;
    learningGoal: string;
    bloomsLevel: string;
    informContent: string[];
    practiceResults: Array<{ question: string; isCorrect: boolean }>;
  }): Promise<SummaryBlock> {
    // Log chain execution
    if (isLogEnabled('ai')) {
      logAiChain('generate-summary-block');
    }

    // 1. Generate prompt
    const prompt = generateSummaryBlockPrompt({
      topic: params.topic,
      learningGoal: params.learningGoal,
      bloomsLevel: params.bloomsLevel,
      informContent: params.informContent,
      practiceResults: params.practiceResults,
    });

    // 2. Call Claude
    const rawResponse = await this.llmService.callClaude(prompt);

    // 3. Parse and validate response
    const summaryBlock = this.parser.parse(rawResponse);

    return summaryBlock;
  }
}
