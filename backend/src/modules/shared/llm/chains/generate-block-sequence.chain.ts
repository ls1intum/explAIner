import { Injectable, Logger } from '@nestjs/common';
import { isLogEnabled } from '../../../../config/logging.config';
import { LlmService } from '../llm.service';
import { generateBlockSequencePrompt } from '../prompts/generate-block-sequence.prompt';
import {
  BlockSequenceMode,
  SoloLevel,
} from '../../../../domain/schemas/enums.schema';
import {
  InitialBlockSequenceParserSchema,
  SubsequentBlockSequenceParserSchema,
  type BlockSequenceParser,
} from '../../../../domain/schemas/llm-parser/block-sequence.schema';
import type { WrongAnswer } from '../../../../domain/schemas/llm-parser/block-sequence.schema';

/** Chain generating a block sequence = 1 x inform block + 3 x practice block */
@Injectable()
export class GenerateBlockSequenceChain {
  private readonly logger = new Logger('AI-CHAIN');

  constructor(private llmService: LlmService) {}

  async execute(params: {
    mode: BlockSequenceMode;
    topic: string;
    learningGoal: string;
    bloomsLevel: string;
    priorKnowledge?: string;
    wrongAnswers?: WrongAnswer[];
    soloLevels: SoloLevel[];
  }): Promise<BlockSequenceParser> {
    if (isLogEnabled('ai-chain')) {
      this.logger.log(`generate-block-sequence-${params.mode}`);
    }

    // Generate prompt
    const prompt = generateBlockSequencePrompt({
      mode: params.mode,
      topic: params.topic,
      learningGoal: params.learningGoal,
      bloomsLevel: params.bloomsLevel,
      priorKnowledge: params.priorKnowledge,
      soloLevels: params.soloLevels.map(level => level.toString()),
      wrongAnswers: params.wrongAnswers,
    });

    // Call LLM with prompt
    const llmResponse = await this.llmService.callClaude(prompt);

    // Parse LLM output against schema and return response
    if (params.mode === BlockSequenceMode.INITIAL) {
      return this.llmService.createParser(InitialBlockSequenceParserSchema).parse(llmResponse);
    }
    return this.llmService.createParser(SubsequentBlockSequenceParserSchema).parse(llmResponse);
  }
}
