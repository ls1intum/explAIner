import { Injectable } from '@nestjs/common';
import { LlmService } from '../llm.service';
import { Parser } from '../llm.parser';
import { generateBlockSequencePrompt } from '../prompts/generate-block-sequence.prompt';
import { aiGeneratedBlockSequenceSchema, type AIGeneratedBlockSequence } from '../schemas/block-sequence.schema';
import { BlockSequenceMode } from '../../../common/enums/block-sequence-mode.enum';
import type { WrongAnswer } from '../../../common/types/practice-blocks.types';
import { SoloLevel } from '@prisma/client';
import { logAiChain } from '../../../common/utils/logging.utils';
import { isLogEnabled } from '../../../common/config/logging.config';
import { extractJsonFromMarkdown } from '../../../common/utils/json-parser.util';

/**
 * Unified chain for generating block sequences (initial or subsequent)
 * Orchestrates: Prompt -> AI Call -> Transform -> Parse -> Validate
 */
@Injectable()
export class GenerateBlockSequenceChain {
  private parser = new Parser(aiGeneratedBlockSequenceSchema);

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
    // Log chain execution
    if (isLogEnabled('ai')) {
      logAiChain(`generate-block-sequence-${params.mode}`);
    }

    // 1. Generate prompt based on mode
    const prompt = generateBlockSequencePrompt({
      mode: params.mode,
      topic: params.topic,
      learningGoal: params.learningGoal,
      bloomsLevel: params.bloomsLevel,
      priorKnowledge: params.priorKnowledge,
      soloLevels: params.soloLevels.map(level => level.toString()),
      wrongAnswers: params.wrongAnswers,
    });

    // 2. Call Claude
    const rawResponse = await this.llmService.callClaude(prompt);

    // 3. Transform keyFacts/keyMisconceptions to keyPoints before validation
    const transformedResponse = this.transformResponse(rawResponse, params.mode);

    // 4. Parse and validate response
    const blockSequence = this.parser.parse(transformedResponse);

    return blockSequence;
  }

  /**
   * Transform AI response to map keyFacts/keyMisconceptions to keyPoints
   * This allows AI to generate mode-specific field names while we validate against unified schema
   */
  private transformResponse(rawResponse: string, mode: BlockSequenceMode): string {
    try {
      // Extract JSON from markdown if present
      const jsonText = extractJsonFromMarkdown(rawResponse);
      const parsed = JSON.parse(jsonText);

      // Check if inform block exists
      if (!parsed.informBlock) {
        throw new Error('Response missing informBlock');
      }

      // Determine which field to look for based on mode
      const sourceField = mode === BlockSequenceMode.INITIAL ? 'keyFacts' : 'keyMisconceptions';

      // Check if the expected field exists
      if (!parsed.informBlock[sourceField]) {
        throw new Error(`Response missing ${sourceField} in informBlock`);
      }

      // Transform: rename keyFacts/keyMisconceptions to keyPoints
      parsed.informBlock.keyPoints = parsed.informBlock[sourceField];
      delete parsed.informBlock[sourceField];

      return JSON.stringify(parsed);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to transform AI response: ${error.message}`);
      }
      throw new Error('Failed to transform AI response: Unknown error');
    }
  }
}
