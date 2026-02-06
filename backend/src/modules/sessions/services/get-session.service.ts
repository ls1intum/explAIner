import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { GetSessionResponseDto } from '../dto/get-session.response.dto';
import { LogService } from '../../../common/decorators/service-logging.decorator';

@Injectable()
export class GetSessionService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get session by ID with all blocks
   * Used for rehydrating frontend state on page reload
   */
  @LogService()
  async getById(sessionId: string): Promise<GetSessionResponseDto> {
    // Query session with all related blocks
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        blocks: {
          orderBy: { orderIndex: 'asc' },
          include: {
            informBlockMessages: {
              orderBy: { timestamp: 'asc' },
            },
            practiceBlock: true,
            summaryBlock: true,
          },
        },
      },
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${sessionId} not found`);
    }

    // Transform to match frontend structure
    return {
      session: {
        id: session.id,
        topic: session.learningTopicOrQuestion,
        learningGoal: session.learningGoal,
        bloomsLevel: session.learningGoalBloomsLevel,
        totalBlocks: session.totalBlocks,
        currentBlockIndex: session.currentBlockIndex,
      },
      blocks: session.blocks.map((block) => ({
        id: block.id,
        sessionId: block.sessionId,
        orderIndex: block.orderIndex,
        alreadyViewed: block.alreadyViewed,
        type: block.type,
        informBlockMessages: block.informBlockMessages?.map((msg) => ({
          id: msg.id,
          blockId: msg.blockId,
          message: msg.message,
          sender: msg.sender,
          timestamp: msg.timestamp,
        })),
        practiceBlock: block.practiceBlock
          ? {
              blockId: block.practiceBlock.blockId,
              soloLevel: block.practiceBlock.soloLevel,
              question: block.practiceBlock.question,
              answerOptions: block.practiceBlock.answerOptions,
              correctAnswerOptionIndices:
                block.practiceBlock.correctAnswerOptionIndices,
              studentAnswerOptionIndices:
                block.practiceBlock.studentAnswerOptionIndices,
              studentAnswerIsCorrect:
                block.practiceBlock.studentAnswerIsCorrect,
            }
          : undefined,
        summaryBlock: block.summaryBlock
          ? {
              blockId: block.summaryBlock.blockId,
              sessionSummary: block.summaryBlock.sessionSummary,
            }
          : undefined,
      })),
    };
  }
}
