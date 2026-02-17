import { Injectable } from '@nestjs/common';
import { LlmService } from '../llm.service';
import { Parser } from '../llm.parser';
import { generateInitialBlockSequencePrompt } from '../prompts/generate-initial-block-sequence.prompt';
import { initialBlockSequenceSchema, type InitialBlockSequence } from '../schemas/initial-block-sequence.schema';
import { SoloLevel } from '@prisma/client';
import { logAiChain } from '../../../common/utils/logging.utils';
import { isLogEnabled } from '../../../common/config/logging.config';

/**
 * Chain for generating initial block sequence (block_sequence_counter = 0)
 * Orchestrates: Prompt -> AI Call -> Parse -> Validate
 */
@Injectable()
export class GenerateInitialBlockSequenceChain {
  private parser = new Parser(initialBlockSequenceSchema);

  constructor(private llmService: LlmService) {}

  async execute(params: {
    topic: string;
    learningGoal: string;
    bloomsLevel: string;
    priorKnowledge?: string;
    soloLevels: SoloLevel[];
  }): Promise<InitialBlockSequence> {
    // Log chain execution
    if (isLogEnabled('ai')) {
      logAiChain('generate-initial-block-sequence');
    }

    // 1. Generate prompt for initial block sequence
    const prompt = generateInitialBlockSequencePrompt({
      topic: params.topic,
      learningGoal: params.learningGoal,
      bloomsLevel: params.bloomsLevel,
      priorKnowledge: params.priorKnowledge,
      soloLevels: params.soloLevels.map(level => level.toString()),
    });

    // 2. Call Claude
    const rawResponse = await this.llmService.callClaude(prompt);

    // 3. Parse and validate response
    const blockSequence = this.parser.parse(rawResponse);

    return blockSequence;
  }
}
