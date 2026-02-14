import { Injectable } from '@nestjs/common';
import { AiService } from '../ai.service';
import { SubsequentBlockSequenceParser } from '../parsers/subsequent-block-sequence.parser';
import { generateSubsequentBlockSequencePrompt } from '../prompts/generate-subsequent-block-sequence.prompt';
import type { SubsequentBlockSequence } from '../schemas/subsequent-block-sequence.schema';
import type { WrongAnswer } from '../../../common/types/practice-blocks.types';
import { SoloLevel } from '@prisma/client';
import { logAiChain } from '../../../common/utils/logging.utils';
import { isLogEnabled } from '../../../common/config/logging.config';

/**
 * Chain for generating subsequent block sequence (block_sequence_counter > 0)
 * Orchestrates: Prompt -> AI Call -> Parse -> Validate
 */
@Injectable()
export class GenerateSubsequentBlockSequenceChain {
  private parser = new SubsequentBlockSequenceParser();

  constructor(private aiService: AiService) {}

  async execute(params: {
    topic: string;
    learningGoal: string;
    bloomsLevel: string;
    priorKnowledge?: string;
    wrongAnswers?: WrongAnswer[];
    soloLevels: SoloLevel[];
  }): Promise<SubsequentBlockSequence> {
    // Log chain execution
    if (isLogEnabled('ai')) {
      logAiChain('generate-subsequent-block-sequence');
    }

    // 1. Generate prompt for subsequent block sequence
    const prompt = generateSubsequentBlockSequencePrompt({
      topic: params.topic,
      learningGoal: params.learningGoal,
      bloomsLevel: params.bloomsLevel,
      priorKnowledge: params.priorKnowledge,
      soloLevels: params.soloLevels.map(level => level.toString()),
      wrongAnswers: params.wrongAnswers,
    });

    // 2. Call Claude
    const rawResponse = await this.aiService.callClaude(prompt);

    // 3. Parse and validate response
    const blockSequence = this.parser.parse(rawResponse);

    return blockSequence;
  }
}
