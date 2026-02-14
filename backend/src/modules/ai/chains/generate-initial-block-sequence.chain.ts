import { Injectable } from '@nestjs/common';
import { AiService } from '../ai.service';
import { InitialBlockSequenceParser } from '../parsers/initial-block-sequence.parser';
import { generateInitialBlockSequencePrompt } from '../prompts/generate-initial-block-sequence.prompt';
import { getSOLOLevelsForBlooms } from '../../../common/utils/didactical-frameworks/solo-taxonomy.util';
import type { InitialBlockSequence } from '../schemas/initial-block-sequence.schema';

/**
 * Chain for generating initial block sequence (block_sequence_counter = 0)
 * Orchestrates: Prompt -> AI Call -> Parse -> Validate
 */
@Injectable()
export class GenerateInitialBlockSequenceChain {
  private parser = new InitialBlockSequenceParser();

  constructor(private aiService: AiService) {}

  async execute(params: {
    topic: string;
    learningGoal: string;
    bloomsLevel: string;
    priorKnowledge?: string;
  }): Promise<InitialBlockSequence> {
    // 1. Determine appropriate SOLO levels based on Bloom's level
    const soloLevels = getSOLOLevelsForBlooms(params.bloomsLevel);
    
    // 2. Generate prompt for initial block sequence
    const prompt = generateInitialBlockSequencePrompt({
      topic: params.topic,
      learningGoal: params.learningGoal,
      bloomsLevel: params.bloomsLevel,
      priorKnowledge: params.priorKnowledge,
      soloLevels: soloLevels.map(level => level.toString()),
    });

    // 3. Call Claude
    const rawResponse = await this.aiService.callClaude(
      prompt,
      'generate-initial-block-sequence.prompt.ts',
    );

    // 4. Parse and validate response
    const blockSequence = this.parser.parse(rawResponse);

    return blockSequence;
  }
}
