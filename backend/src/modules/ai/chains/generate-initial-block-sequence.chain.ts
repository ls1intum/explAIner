import { Injectable } from '@nestjs/common';
import { AiService } from '../ai.service';
import { InitialBlockSequenceParser } from '../parsers/initial-block-sequence.parser';
import { generateInitialBlockSequencePrompt } from '../prompts/generate-initial-block-sequence.prompt';
import type { InitialBlockSequence } from '../schemas/initial-block-sequence.schema';
import { SoloLevel } from '@prisma/client';

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
    soloLevels: SoloLevel[];
  }): Promise<InitialBlockSequence> {
    // 1. Generate prompt for initial block sequence
    const prompt = generateInitialBlockSequencePrompt({
      topic: params.topic,
      learningGoal: params.learningGoal,
      bloomsLevel: params.bloomsLevel,
      priorKnowledge: params.priorKnowledge,
      soloLevels: params.soloLevels.map(level => level.toString()),
    });

    // 2. Call Claude
    const rawResponse = await this.aiService.callClaude(
      prompt,
      'generate-initial-block-sequence.prompt.ts',
    );

    // 3. Parse and validate response
    const blockSequence = this.parser.parse(rawResponse);

    return blockSequence;
  }
}
