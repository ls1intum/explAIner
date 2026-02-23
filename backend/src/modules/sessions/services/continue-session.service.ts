import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ContinueSessionResponseDto } from '../dto/response/continue-session.response.dto';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import {
  getSessionWithAllBlocks,
  getBlockSequenceCounter,
  getCurrentBlockSequenceBlocks,
  getPracticeBlocks,
  areAllPracticeBlocksAnswered,
  areAllPracticeBlocksCorrect,
  findNextUnansweredPracticeBlock,
  mapToContinueSessionResponseDto,
  requireSessionExists
} from '../session.utils';

/** Service determining next action after user clicked "Continue" button on any block:
 *  - "navigate"      → to next unanswered practice block
 *  - "next sequence" → to generate next block sequence
 *  - "summary"       → to generate summary block
 *  - "prompt user"   → to prompt user to choose between (A) continue current session or (B) start new session with easier goal
 */
@Injectable()
export class ContinueSessionService {
  constructor(
    private prisma: PrismaService,
  ) {}

  @LogService()
  async continue(sessionId: string): Promise<ContinueSessionResponseDto> {

    // Ensure session exists
    await requireSessionExists(this.prisma, sessionId);

    // Fetch session and current block sequence counter
    const session = await getSessionWithAllBlocks(this.prisma, sessionId);
    const blockSequenceCounter = getBlockSequenceCounter(session.blocks);

    // Fetch current block sequence practice blocks
    const currentSequenceBlocks = getCurrentBlockSequenceBlocks(session.blocks);
    const currentPracticeBlocks = getPracticeBlocks(currentSequenceBlocks);

    // Check if all practice blocks are answered & answered correctly
    const allAnswered = areAllPracticeBlocksAnswered(currentPracticeBlocks);
    const allCorrect = areAllPracticeBlocksCorrect(currentPracticeBlocks);

    // next action = "navigate" (if there is an unanswered practice block)
    if (!allAnswered) {
      const next = findNextUnansweredPracticeBlock(currentSequenceBlocks);
      if (next) return mapToContinueSessionResponseDto('navigate', next.orderIndex);
    }

    // next action = "summary" (if all practice blocks are answered correctly)
    if (allCorrect) 
      return mapToContinueSessionResponseDto('summary');

    // next action = "prompt user" (if block sequence counter >= 2)
    if (blockSequenceCounter >= 2) 
      return mapToContinueSessionResponseDto('prompt-user');

    // next action = "next sequence" (if block sequence counter < 2)
    return mapToContinueSessionResponseDto('next-sequence');
  }
}
