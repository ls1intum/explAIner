import { Injectable } from '@nestjs/common';
import { LlmService } from '../llm.service';
import { Parser } from '../llm.parser';
import { generateBlockSequencePrompt } from '../prompts/generate-block-sequence.prompt';
import {
  aiGeneratedBlockSequenceInitialSchema,
  aiGeneratedBlockSequenceSubsequentSchema,
  BlockSequenceMode,
  type AIGeneratedBlockSequenceInitial,
  type AIGeneratedBlockSequenceSubsequent,
} from '../../../../domain/schemas/blocks/block-sequence.schema';
import type { WrongAnswer } from '../../../../domain/schemas/blocks/practice/practice-block.schema';
import { SoloLevel } from '@prisma/client';
import { logAiChain } from '../../../../common/utils/logging.utils';
import { isLogEnabled } from '../../../../config/logging.config';

/** Union return type for block sequence chain (initial or subsequent). */
export type AIGeneratedBlockSequence = AIGeneratedBlockSequenceInitial | AIGeneratedBlockSequenceSubsequent;

/**
 * Chain for generating block sequences (initial or subsequent).
 * Uses mode-specific schema: keyFacts (initial) or keyMisconceptions (subsequent).
 */
@Injectable()
export class GenerateBlockSequenceChain {
  constructor(private llmService: LlmService) {}

  async execute(params: {
    mode: BlockSequenceMode;
    topic: string;
    learningGoal: string;
    bloomsLevel: string;
    priorKnowledge?: string;
    wrongAnswers?: WrongAnswer[];
    soloLevels: SoloLevel[];
  }): Promise<AIGeneratedBlockSequence> {
    if (isLogEnabled('ai')) {
      logAiChain(`generate-block-sequence-${params.mode}`);
    }

    const prompt = generateBlockSequencePrompt({
      mode: params.mode,
      topic: params.topic,
      learningGoal: params.learningGoal,
      bloomsLevel: params.bloomsLevel,
      priorKnowledge: params.priorKnowledge,
      soloLevels: params.soloLevels.map(level => level.toString()),
      wrongAnswers: params.wrongAnswers,
    });

    const rawResponse = await this.llmService.callClaude(prompt);

    const retryFn = async (error: string) => {
      const fixPrompt = `Your previous response failed validation with this error: ${error}. Please return a valid JSON response matching the required format.`;
      return this.llmService.callClaude(fixPrompt);
    };

    if (params.mode === BlockSequenceMode.INITIAL) {
      const parser = new Parser(aiGeneratedBlockSequenceInitialSchema, retryFn);
      return parser.parseWithRetry(rawResponse);
    }
    const parser = new Parser(aiGeneratedBlockSequenceSubsequentSchema, retryFn);
    return parser.parseWithRetry(rawResponse);
  }
}
