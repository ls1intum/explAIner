import { Injectable } from '@nestjs/common';
import { AiService } from '../ai.service';
import { BlockSequenceParser } from '../parsers/block-sequence.parser';
import { generateBlockSequencePrompt } from '../prompts/generate-block-sequence.prompt';
import { getSOLOLevelsForBlooms } from '../../../common/utils/didactical-frameworks/solo-taxonomy.util';
import { BlockSequenceMode } from '../../../common/enums/block-sequence-mode.enum';
import type { UnifiedBlockSequence } from '../schemas/block-sequence.schema';
import type { WrongAnswer } from '../../../common/types/practice-blocks.types';

/**
 * Chain for generating next block sequence (initial or subsequent)
 * Orchestrates: Prompt -> AI Call -> Parse -> Validate
 */
@Injectable()
export class GenerateBlockSequenceChain {
  private parser = new BlockSequenceParser();

  constructor(private aiService: AiService) {}

  async execute(params: {
    mode: BlockSequenceMode;
    topic: string;
    learningGoal: string;
    bloomsLevel: string;
    priorKnowledge?: string;
    wrongAnswers?: WrongAnswer[];
  }): Promise<UnifiedBlockSequence> {
    // 1. Determine appropriate SOLO levels based on Bloom's level
    const soloLevels = getSOLOLevelsForBlooms(params.bloomsLevel);
    
    // 2. Generate prompt based on mode
    const prompt = generateBlockSequencePrompt({
      mode: params.mode, // "initial" or "subsequent"
      topic: params.topic,
      learningGoal: params.learningGoal,
      bloomsLevel: params.bloomsLevel,
      priorKnowledge: params.priorKnowledge,
      soloLevels: soloLevels.map(level => level.toString()),
      wrongAnswers: params.wrongAnswers,
    });

    // 3. Call Claude
    const rawResponse = await this.aiService.callClaude(
      prompt,
      'generate-block-sequence.prompt.ts',
    );

    // 4. Parse and validate response
    const blockSequence = this.parser.parse(rawResponse, params.mode);

    return blockSequence;
  }
}
