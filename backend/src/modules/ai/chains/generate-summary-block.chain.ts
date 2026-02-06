import { Injectable } from '@nestjs/common';
import { AiService } from '../ai.service';
import { SummaryBlockParser } from '../parsers/summary-block.parser';
import { generateSummaryBlockPrompt } from '../prompts/generate-summary-block.prompt';
import type { SummaryBlock } from '../schemas/summary-block.schema';

/**
 * Chain for generating summary block
 * Orchestrates: Prompt -> AI Call -> Parse -> Validate
 */
@Injectable()
export class GenerateSummaryBlockChain {
  private parser = new SummaryBlockParser();

  constructor(private aiService: AiService) {}

  async execute(params: {
    topic: string;
    learningGoal: string;
    bloomsLevel: string;
    informContent: string[];
    practiceResults: Array<{ question: string; isCorrect: boolean }>;
  }): Promise<SummaryBlock> {
    // 1. Generate prompt
    const prompt = generateSummaryBlockPrompt({
      topic: params.topic,
      learningGoal: params.learningGoal,
      bloomsLevel: params.bloomsLevel,
      informContent: params.informContent,
      practiceResults: params.practiceResults,
    });

    // 2. Call Claude
    const rawResponse = await this.aiService.callClaude(
      prompt,
      'generate-summary-block.prompt.ts',
    );

    // 3. Parse and validate response
    const summaryBlock = this.parser.parse(rawResponse);

    return summaryBlock;
  }
}
