import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { GenerateBlockSequenceChain } from '../../ai/llm/chains/generate-block-sequence.chain';
import {
  BlockSequenceMode,
  BlockType,
  SoloLevel,
} from '../../../domain/schemas/enums.schema';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import type { WrongAnswer } from '../../../domain/schemas/llm-parser/block-sequence.schema';
import { GenerateBlockSequenceResponseDto } from '../dto/response/generate-block-sequence.response.dto';
import { getSOLOLevelsForBlooms } from '../../../domain/didactical-frameworks/solo-taxonomy.util';
import { getSessionWithAllBlocks } from '../../sessions/session.utils';
import {
  mapToBlockResponseDto,
  extractWrongAnswersFromPracticeBlocks,
  formatInformBlockMessage,
} from '../block.utils';

/** Prisma-like client for DB ops (supports transaction client from $transaction) */
type PrismaLike = Pick<PrismaService, 'session' | 'block'>;

/**
 * Service generating a block sequence = 1 x inform block + 3 x practice block
 */
@Injectable()
export class GenerateBlockSequenceService {
  constructor(
    private prisma: PrismaService,
    private generateBlockSequenceChain: GenerateBlockSequenceChain,
  ) {}

  @LogService()
  // Atomic: all DB ops commit together or roll back on any failure
  async generate(
    sessionId: string,
    tx?: PrismaLike, // When provided, all DB ops run inside caller's atomic transaction
  ): Promise<GenerateBlockSequenceResponseDto> {
    // When called without tx (e.g. from controller), run in internal atomic transaction
    if (!tx) {
      return this.prisma.$transaction(
        (t) => this.generate(sessionId, t),
        { timeout: 30_000 },
      );
    }
    const db = tx;

    // Fetch session data
    const session = await getSessionWithAllBlocks(db as PrismaService, sessionId);

    // Detect block-sequence mode
    // > INITIAL      = first block sequence of the session             -> provides information
    // > SUBSEQUENT   = any subsequent block sequences of the session   -> provide further information and clarify misconceptions of previous block sequence
    const mode =
      session.blocks.length === 0
        ? BlockSequenceMode.INITIAL
        : BlockSequenceMode.SUBSEQUENT;

    // Calculate starting order index for new block sequence blocks
    const nextOrderIndexStart =
      mode === BlockSequenceMode.INITIAL ? 0 : session.blocks.length;

    // Only if mode = SUBSEQUENT: extract wrong student answers from last block sequence practice questions
    const wrongAnswers: WrongAnswer[] =
      mode === BlockSequenceMode.SUBSEQUENT
        ? extractWrongAnswersFromPracticeBlocks(session.blocks, 'lastSequence')
        : [];

    // Call chain
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

    // Format inform block message depending on block-sequence mode
    // > INITIAL      message = explanation + key facts + summary
    // > SUBSEQUENT   message = explanation + key misconceptions + summary
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

    // Create inform block and persist in database
    const informBlockCreated = await db.block.create({
      data: {
        sessionId,
        orderIndex: nextOrderIndexStart,
        type: BlockType.Inform,
        alreadyViewed: mode === BlockSequenceMode.INITIAL, // Only initial block is pre-viewed (to allow page reload during creation)
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

    // Persist 3 practice blocks in database
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

    // Update session total blocks count
    const newTotal =
      mode === BlockSequenceMode.INITIAL ? 4 : session.totalBlocks + 4;
    await db.session.update({
      where: { id: sessionId },
      data: { totalBlocks: newTotal },
    });

    // Return response
    return {
      informBlock: mapToBlockResponseDto(informBlockCreated),
      practiceBlocks: [
        mapToBlockResponseDto(practiceBlocks[0]),
        mapToBlockResponseDto(practiceBlocks[1]),
        mapToBlockResponseDto(practiceBlocks[2]),
      ],
    } as GenerateBlockSequenceResponseDto;
  }
}
