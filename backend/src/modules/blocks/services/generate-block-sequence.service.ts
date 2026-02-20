import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { GenerateBlockSequenceChain } from '../../ai/llm/chains/generate-block-sequence.chain';
import { BlockSequenceMode } from '../../../domain/schemas/blocks/block-sequence.schema';
import { BlockType, SoloLevel } from '@prisma/client';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import type { WrongAnswer } from '../../../domain/schemas/blocks/practice/practice-block.schema';
import { GenerateBlockSequenceResponseDto } from '../dto/response/generate-block-sequence.response.dto';
import { getSOLOLevelsForBlooms } from '../../../domain/didactical-frameworks/solo-taxonomy.util';
import { extractWrongAnswersFromLastSequence } from '../utils/block.utils';
import { getSessionWithBlocks } from '../../sessions/utils/session.utils';
import type { BlockWithIncludes } from '../utils/block-mapper.utils';
import { blockToResponse } from '../utils/block-mapper.utils';

/**
 * Unified service for generating block sequences (initial or subsequent).
 * Mode: 0 blocks → INITIAL (keyFacts); has blocks → SUBSEQUENT (keyMisconceptions).
 */
@Injectable()
export class GenerateBlockSequenceService {
  constructor(
    private prisma: PrismaService,
    private generateBlockSequenceChain: GenerateBlockSequenceChain,
  ) {}

  @LogService()
  async generate(sessionId: string): Promise<GenerateBlockSequenceResponseDto> {
    const session = await getSessionWithBlocks(this.prisma, sessionId);

    // 2. Auto-detect mode based on existing blocks
    const mode = session.blocks.length === 0 
      ? BlockSequenceMode.INITIAL 
      : BlockSequenceMode.SUBSEQUENT;

    // 3. Calculate starting order index
    const nextOrderIndexStart = mode === BlockSequenceMode.INITIAL 
      ? 0 
      : session.blocks.length;

    // 4. Extract wrong answers (only for SUBSEQUENT mode)
    const wrongAnswers: WrongAnswer[] = 
      mode === BlockSequenceMode.SUBSEQUENT
        ? extractWrongAnswersFromLastSequence(session.blocks)
        : [];

    // 5. Get prior knowledge context
    const priorKnowledge = session.priorKnowledge ?? '';

    // 6. Determine appropriate SOLO levels based on Bloom's level
    const soloLevels = getSOLOLevelsForBlooms(session.learningGoalBloomsLevel);

    // 7. Call unified chain with mode parameter
    const blockSequence = await this.generateBlockSequenceChain.execute({
      mode,
      topic: session.topic,
      learningGoal: session.learningGoal,
      bloomsLevel: session.learningGoalBloomsLevel,
      priorKnowledge,
      wrongAnswers: mode === BlockSequenceMode.SUBSEQUENT ? wrongAnswers : undefined,
      soloLevels,
    });

    // 8. Create inform block with formatted message
    const label = mode === BlockSequenceMode.INITIAL ? 'KEY FACTS' : 'KEY MISCONCEPTIONS';
    const keyPoints =
      'keyFacts' in blockSequence.informBlock
        ? blockSequence.informBlock.keyFacts
        : blockSequence.informBlock.keyMisconceptions;

    const formattedMessage = `${blockSequence.informBlock.explanation}

${label}
${keyPoints.map(item => `${item}`).join('\n')}

SUMMARY
${blockSequence.informBlock.summary}`;

    const informBlockCreated = await this.prisma.block.create({
      data: {
        sessionId,
        orderIndex: nextOrderIndexStart,
        type: BlockType.Inform,
        alreadyViewed: mode === BlockSequenceMode.INITIAL, // Only initial block is pre-viewed
        informBlock: {
          create: {
            messages: {
              create: [{ message: formattedMessage, sender: 'Owlbert' }],
            },
          },
        },
      },
      include: {
        informBlock: { include: { messages: true } },
      },
    });

    // 9. Create 3 practice blocks
    const practiceBlocks = await Promise.all(
      blockSequence.practiceBlocks.map(async (practiceBlock, index) => {
        return this.prisma.block.create({
          data: {
            sessionId,
            orderIndex: nextOrderIndexStart + index + 1,
            type: BlockType.Practice,
            practiceBlock: {
              create: {
                soloLevel: practiceBlock.soloLevel as SoloLevel,
                question: practiceBlock.question,
                answerOptions: practiceBlock.answerOptions,
                correctAnswerOptionIndices: practiceBlock.correctAnswerOptionIndices,
              },
            },
          },
          include: {
            practiceBlock: true,
          },
        });
      }),
    );

    // 10. Update session total blocks count
    const newTotal = mode === BlockSequenceMode.INITIAL 
      ? 4 
      : session.totalBlocks + 4;
    
    await this.prisma.session.update({
      where: { id: sessionId },
      data: { totalBlocks: newTotal },
    });

    return {
      informBlock: blockToResponse(informBlockCreated as BlockWithIncludes),
      practiceBlocks: [
        blockToResponse(practiceBlocks[0] as BlockWithIncludes),
        blockToResponse(practiceBlocks[1] as BlockWithIncludes),
        blockToResponse(practiceBlocks[2] as BlockWithIncludes),
      ],
    } as GenerateBlockSequenceResponseDto;
  }
}
