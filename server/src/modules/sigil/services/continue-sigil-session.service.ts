import { Injectable } from '@nestjs/common';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import {
  areAllPracticeBlocksAnswered,
  arePracticeBlocksPassed,
  findNextUnansweredPracticeBlock,
  mapToContinueSessionResponseDto,
} from '../../sessions/sessions.utils';
import {
  getBlockSequenceCounter,
  getCurrentBlockSequencePracticeBlocks,
} from '../../shared/shared.utils';
import { SessionsRepository } from '../../shared/database/repositories/sessions.repository';

@Injectable()
export class ContinueSigilSessionService {
  constructor(private sessionsRepository: SessionsRepository) {}

  @LogService()
  async continue(sessionId: string) {
    await this.sessionsRepository.requireSessionExists(sessionId);
    const session = await this.sessionsRepository.getSessionWithAllBlocks(sessionId);

    // Chat or Text mode: no practice blocks, nothing to continue to
    if (session.sigilMode === 'Chat' || session.sigilMode === 'Text') {
      return mapToContinueSessionResponseDto('navigate', 0);
    }

    const blockSequenceCounter = getBlockSequenceCounter(session.blocks);
    const currentPracticeBlocks = getCurrentBlockSequencePracticeBlocks(session.blocks);

    const allAnswered = areAllPracticeBlocksAnswered(currentPracticeBlocks);
    const passed = arePracticeBlocksPassed(currentPracticeBlocks);

    if (!allAnswered) {
      const next = findNextUnansweredPracticeBlock(currentPracticeBlocks);
      if (next) return mapToContinueSessionResponseDto('navigate', next.orderIndex);
    }

    // Passing at 2 of 3 correct (not a perfect score) completes the round.
    if (passed) return mapToContinueSessionResponseDto('summary');

    if (blockSequenceCounter >= 2) return mapToContinueSessionResponseDto('prompt-user');

    return mapToContinueSessionResponseDto('next-sequence');
  }
}
