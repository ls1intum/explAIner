import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ContinueSessionResponseDto } from '../dto/response/continue-session.response.dto';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import { BlockType } from '@prisma/client';

@Injectable()
export class ContinueSessionService {
  constructor(private prisma: PrismaService) {}

  @LogService()
  async continue(
    sessionId: string,
  ): Promise<ContinueSessionResponseDto> {
    // Get session with all blocks
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        blocks: {
          include: {
            practiceBlock: true,
          },
          orderBy: {
            orderIndex: 'asc',
          },
        },
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    // Calculate block sequence counter (number of INFORM blocks)
    const informBlocks = session.blocks.filter(
      (block) => block.type === BlockType.Inform,
    );
    const blockSequenceCounter = informBlocks.length;

    // Get current block sequence (last 4 blocks: 1 INFORM + 3 PRACTICE)
    const currentSequenceStartIndex = (blockSequenceCounter - 1) * 4;
    const currentSequenceBlocks = session.blocks.slice(
      currentSequenceStartIndex,
      currentSequenceStartIndex + 4,
    );

    // Get the 3 practice blocks in current sequence
    const practiceBlocksInSequence = currentSequenceBlocks.filter(
      (block) => block.type === BlockType.Practice,
    );

    // Check if all 3 practice blocks are answered correctly
    const allPracticeBlocksAnswered = practiceBlocksInSequence.every(
      (block) => block.practiceBlock?.studentAnswerIsCorrect !== null,
    );

    const allPracticeBlocksCorrect = practiceBlocksInSequence.every(
      (block) => block.practiceBlock?.studentAnswerIsCorrect === true,
    );

    // Determine next action based on session flow logic
    if (!allPracticeBlocksAnswered) {
      // Navigate to next unanswered block
      const nextUnansweredBlock = currentSequenceBlocks.find(
        (block) =>
          block.type === BlockType.Practice &&
          block.practiceBlock?.studentAnswerIsCorrect === null,
      );

      if (nextUnansweredBlock) {
        return {
          action: 'navigate',
          nextOrderIndex: nextUnansweredBlock.orderIndex,
        };
      }
    }

    // All practice blocks answered - check results
    if (allPracticeBlocksCorrect) {
      // All correct → generate summary
      return {
        action: 'summary',
      };
    }

    // Not all correct
    if (blockSequenceCounter >= 2) {
      // After 1st sequence or more (blockSequenceCounter >= 1), offer easier learning goal
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
