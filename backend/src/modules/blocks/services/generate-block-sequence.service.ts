import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { GenerateBlockSequenceChain } from '../../ai/llm/chains/generate-block-sequence.chain';
import { BlockSequenceMode } from '../../../domain/schemas/enums.schema';
import { BlockType, SoloLevel } from '@prisma/client';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import type { WrongAnswer } from '../../../domain/schemas/base/blocks/practice-block.schema';
import { GenerateBlockSequenceResponseDto } from '../dto/response/generate-block-sequence.response.dto';
import { getSOLOLevelsForBlooms } from '../../../domain/didactical-frameworks/solo-taxonomy.util';
import { getSessionWithBlocks } from '../../sessions/session.utils';
import {
  blockToResponse,
  extractWrongAnswersFromLastSequence,
  formatInformBlockMessage,
  type BlockWithIncludes,
} from '../block.utils';

/** Prisma-like client for DB ops (supports transaction client from $transaction). */
type PrismaLike = Pick<PrismaService, 'session' | 'block'>;

/**
 * Generates a block sequence (1 inform + 3 practice). 
 * INITIAL = first block sequence of the session (key facts);
 * SUBSEQUENT = any subsequent block sequences of the session using wrong answers from last practice set (key misconceptions).
 * Atomic: all DB ops commit together or roll back on any failure.
 */
@Injectable()
export class GenerateBlockSequenceService {
  constructor(
    private prisma: PrismaService,
    private generateBlockSequenceChain: GenerateBlockSequenceChain,
  ) {}

  @LogService()
  async generate(
    sessionId: string,
    tx?: PrismaLike, // When provided, all DB ops run inside caller's atomic transaction.
  ): Promise<GenerateBlockSequenceResponseDto> {
    // When called without tx (e.g. from controller), run in internal atomic transaction.
    if (!tx) {
      return this.prisma.$transaction(
        (t) => this.generate(sessionId, t),
        { timeout: 30_000 },
      );
    }
    const db = tx;
    // 1. Load session with blocks (for mode detection and wrong-answer extraction)
    const session = await getSessionWithBlocks(db as PrismaService, sessionId);

    // 2. Auto-detect mode based on existing blocks (0 → INITIAL, else SUBSEQUENT)
    const mode =
      session.blocks.length === 0
        ? BlockSequenceMode.INITIAL
        : BlockSequenceMode.SUBSEQUENT;
    // 3. Calculate starting order index for new blocks
    const nextOrderIndexStart =
      mode === BlockSequenceMode.INITIAL ? 0 : session.blocks.length;
    // 4. Extract wrong answers from last sequence (only for SUBSEQUENT mode)
    const wrongAnswers: WrongAnswer[] =
      mode === BlockSequenceMode.SUBSEQUENT
        ? extractWrongAnswersFromLastSequence(session.blocks)
        : [];

    // 5. Call chain with mode, context, prior knowledge, wrong answers, SOLO levels
    const blockSequence = await this.generateBlockSequenceChain.execute({
      mode,
      topic: session.topic,
      learningGoal: session.learningGoal,
      bloomsLevel: session.learningGoalBloomsLevel,
      priorKnowledge: session.priorKnowledge ?? '',
      wrongAnswers:
        mode === BlockSequenceMode.SUBSEQUENT ? wrongAnswers : undefined,
      soloLevels: getSOLOLevelsForBlooms(session.learningGoalBloomsLevel),
    });

    // 6. Create inform block with formatted message (explanation + label + key points + summary)
    const label =
      mode === BlockSequenceMode.INITIAL ? 'KEY FACTS' : 'KEY MISCONCEPTIONS';
    const keyPoints =
      'keyFacts' in blockSequence.informBlock
        ? blockSequence.informBlock.keyFacts
        : blockSequence.informBlock.keyMisconceptions;
    const formattedMessage = formatInformBlockMessage(
      blockSequence.informBlock.explanation,
      label,
      keyPoints,
      blockSequence.informBlock.summary,
    );

    const informBlockCreated = await db.block.create({
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

    // 7. Create 3 practice blocks
    const practiceBlocks = await Promise.all(
      blockSequence.practiceBlocks.map(async (practiceBlock, index) => {
        return db.block.create({
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

    // 8. Update session total blocks count
    const newTotal =
      mode === BlockSequenceMode.INITIAL ? 4 : session.totalBlocks + 4;
    await db.session.update({
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
