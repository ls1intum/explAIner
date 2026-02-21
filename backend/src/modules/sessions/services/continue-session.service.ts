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
  mapContinueResponse,
} from '../session.utils';

/** Determines next step after a block: navigate, next sequence, summary, or prompt user. */
@Injectable()
export class ContinueSessionService {
  constructor(private prisma: PrismaService) {}

  @LogService()
  async continue(sessionId: string): Promise<ContinueSessionResponseDto> {
    const session = await getSessionWithBlocks(this.prisma, sessionId);
    const blockSequenceCounter = getBlockSequenceCounter(session.blocks);
    const currentSequenceBlocks = getCurrentBlockSequenceBlocks(session.blocks);
    const currentPracticeBlocks = getPracticeBlocks(currentSequenceBlocks);
    const allAnswered = areAllPracticeBlocksAnswered(currentPracticeBlocks);
    const allCorrect = areAllPracticeBlocksCorrect(currentPracticeBlocks);

    if (!allAnswered) {
      const next = findNextUnansweredPracticeBlock(currentSequenceBlocks);
      if (next) return mapContinueResponse('navigate', next.orderIndex);
    }
    if (allCorrect) return mapContinueResponse('summary');
    if (blockSequenceCounter >= 2) return mapContinueResponse('prompt-user');
    return mapContinueResponse('next-sequence');
  }
}
