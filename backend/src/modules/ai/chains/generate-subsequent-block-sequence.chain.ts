import { Injectable } from '@nestjs/common';
import { AiService } from '../ai.service';
import { SubsequentBlockSequenceParser } from '../parsers/subsequent-block-sequence.parser';
import { generateSubsequentBlockSequencePrompt } from '../prompts/generate-subsequent-block-sequence.prompt';
import { getSOLOLevelsForBlooms } from '../../../common/utils/didactical-frameworks/solo-taxonomy.util';
import type { SubsequentBlockSequence } from '../schemas/subsequent-block-sequence.schema';
import type { WrongAnswer } from '../../../common/types/practice-blocks.types';

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
  }): Promise<SubsequentBlockSequence> {
    // 1. Determine appropriate SOLO levels based on Bloom's level
    const soloLevels = getSOLOLevelsForBlooms(params.bloomsLevel);
    
    // 2. Generate prompt for subsequent block sequence
    const prompt = generateSubsequentBlockSequencePrompt({
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
      'generate-subsequent-block-sequence.prompt.ts',
    );

    // 4. Parse and validate response
    const blockSequence = this.parser.parse(rawResponse);

    return blockSequence;
  }
}
