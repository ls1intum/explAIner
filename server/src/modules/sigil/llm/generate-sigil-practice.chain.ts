import { Injectable, Logger } from '@nestjs/common';
import { LlmService } from '../../shared/llm/llm.service';
import { generateSigilPracticePrompt } from './generate-sigil-practice.prompt';
import { SigilPracticeParserSchema, type SigilPracticeParser } from './sigil-practice.schema';
import { isLogEnabled } from '../../../config/logging.config';

@Injectable()
export class GenerateSigilPracticeChain {
  private readonly logger = new Logger('AI-CHAIN');

  constructor(private llmService: LlmService) {}

  async execute(params: {
    markdownContent: string;
    learningGoal: string;
    bloomsLevel: string;
    soloLevels: string[];
    lang: string;
  }): Promise<SigilPracticeParser> {
    if (isLogEnabled('ai-chain')) {
      this.logger.log('generate-sigil-practice');
    }

    const prompt = generateSigilPracticePrompt(params);
    const llmResponse = await this.llmService.callClaude(prompt);
    return this.llmService.createParser(SigilPracticeParserSchema).parse(llmResponse);
  }
}
