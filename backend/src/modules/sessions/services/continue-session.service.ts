import { Injectable } from '@nestjs/common';
import { ContinueSessionResponseDto } from '../dto/response/continue-session.response.dto';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import {
  areAllPracticeBlocksAnswered,
  areAllPracticeBlocksCorrect,
  findNextUnansweredPracticeBlock,
  mapToContinueSessionResponseDto,
} from '../session.utils';
import {
  getBlockSequenceCounter,
  getCurrentBlockSequencePracticeBlocks,
} from '../../blocks/block.utils';
import { SessionsRepository } from '../../shared/database/sessions.repository';

/** Service determining next action after user clicked "Continue" button on any block:
 *  - "navigate"      → to next unanswered practice block
 *  - "next sequence" → to generate next block sequence
 *  - "summary"       → to generate summary block
 *  - "prompt user"   → to prompt user to choose between (A) continue current session or (B) start new session with easier goal
 */
@Injectable()
export class ContinueSessionService {
  constructor(
    private sessionsRepository: SessionsRepository,
  ) {}

  @LogService()
  async continue(sessionId: string): Promise<ContinueSessionResponseDto> {

    // Ensure session exists
    await this.sessionsRepository.requireSessionExists(sessionId);

    // Fetch session 
    const session = await this.sessionsRepository.getSessionWithAllBlocks(sessionId);

    // Fetch current block sequence counter & current block sequence practice blocks
    const blockSequenceCounter = getBlockSequenceCounter(session.blocks);
    const currentBlockSequencePracticeBlocks = getCurrentBlockSequencePracticeBlocks(session.blocks);

    // Check if all practice blocks are answered & answered correctly
    const allAnswered = areAllPracticeBlocksAnswered(currentBlockSequencePracticeBlocks);
    const allCorrect = areAllPracticeBlocksCorrect(currentBlockSequencePracticeBlocks);

    // next action = "navigate" (if there is an unanswered practice block)
    if (!allAnswered) {
      const next = findNextUnansweredPracticeBlock(currentBlockSequencePracticeBlocks);
      if (next) return mapToContinueSessionResponseDto('navigate', next.orderIndex);
    }

    // next action = "summary" (if all practice blocks of current block sequence were answered correctly)
    if (allCorrect) 
      return mapToContinueSessionResponseDto('summary');

    // next action = "prompt user" (if at least one practice block of current block sequence was not answered correctly & block sequence counter >= 2)
    if (blockSequenceCounter >= 2) 
      return mapToContinueSessionResponseDto('prompt-user');

    // next action = "next sequence" (if at least one practice block of current block sequence was not answered correctly & block sequence counter < 2)
    return mapToContinueSessionResponseDto('next-sequence');
  }
}
