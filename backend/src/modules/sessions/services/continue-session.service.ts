import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ContinueSessionResponseDto } from '../dto/response/continue-session.response.dto';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import {
  getSessionWithBlocks,
  getBlockSequenceCounter,
  getCurrentBlockSequenceBlocks,
  getPracticeBlocks,
  areAllPracticeBlocksAnswered,
  areAllPracticeBlocksCorrect,
  findNextUnansweredPracticeBlock,
} from '../utils/session.utils';

@Injectable()
export class ContinueSessionService {
  constructor(private prisma: PrismaService) {}

  @LogService()
  async continue(
    sessionId: string,
  ): Promise<ContinueSessionResponseDto> {
    const session = await getSessionWithBlocks(this.prisma, sessionId);
    const blockSequenceCounter = getBlockSequenceCounter(session.blocks);
    const currentBlockSequenceBlocks = getCurrentBlockSequenceBlocks(session.blocks);
    const currentBlockSequencePracticeBlocks = getPracticeBlocks(currentBlockSequenceBlocks);
    const allPracticeBlocksAnswered = areAllPracticeBlocksAnswered(
      currentBlockSequencePracticeBlocks,
    );
    const allPracticeBlocksCorrect = areAllPracticeBlocksCorrect(
      currentBlockSequencePracticeBlocks,
    );

    if (!allPracticeBlocksAnswered) {
      const nextUnanswered = findNextUnansweredPracticeBlock(
        currentBlockSequenceBlocks,
      );
      if (nextUnanswered) {
        return {
          action: 'navigate',
          targetBlockIndex: nextUnanswered.orderIndex,
        };
      }
    }

    if (allPracticeBlocksCorrect) {
      return { action: 'summary' };
    }

    if (blockSequenceCounter >= 2) {
      return {
        action: 'prompt-user',
      };
    }

    // Otherwise, continue with next block sequence
    return {
      action: 'next-sequence',
    };
  }
}
