import { Injectable, Logger } from '@nestjs/common';
import { LlmService } from '../../shared/llm/llm.service';
import { generateSigilSubsequentPrompt } from './generate-sigil-subsequent.prompt';
import { SubsequentBlockSequenceParserSchema, type SubsequentBlockSequenceParser, type WrongAnswer } from '../../../domain/schemas/llm-parser/block-sequence.schema';
import { isLogEnabled } from '../../../config/logging.config';

@Injectable()
export class GenerateSigilSubsequentChain {
  private readonly logger = new Logger('AI-CHAIN');

  constructor(private llmService: LlmService) {}

  async execute(params: {
    markdownContent: string;
    learningGoal: string;
    bloomsLevel: string;
    soloLevels: string[];
    wrongAnswers: WrongAnswer[];
    lang: string;
  }): Promise<SubsequentBlockSequenceParser> {
    if (isLogEnabled('ai-chain')) {
      this.logger.log('generate-sigil-subsequent');
    }

    const prompt = generateSigilSubsequentPrompt(params);
    const llmResponse = await this.llmService.callClaude(prompt);
    return this.llmService.createParser(SubsequentBlockSequenceParserSchema).parse(llmResponse);
  }
}
