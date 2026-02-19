import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { GetSessionResponseDto } from '../dto/response/get-session.response.dto';
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
            informBlock: {
              include: {
                messages: { orderBy: { timestamp: 'asc' } },
              },
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

    // Transform to match session schema structure
    return {
      id: session.id,
      topic: session.topic,
      priorKnowledge: session.priorKnowledge ?? undefined,
      learningGoal: {
        learningGoal: session.learningGoal,
        bloomsLevel: session.learningGoalBloomsLevel,
      },
      totalBlocks: session.totalBlocks,
      currentBlockIndex: session.currentBlockIndex,
      blocks: session.blocks.map((block) => {
        if (block.type === 'Inform' && block.informBlock) {
          return {
            id: block.id,
            sessionId: block.sessionId,
            orderIndex: block.orderIndex,
            alreadyViewed: block.alreadyViewed,
            type: 'Inform' as const,
            content: block.informBlock.messages.map((msg) => ({
              id: msg.id,
              informBlockId: block.id,
              message: msg.message,
              sender: msg.sender,
              timestamp: (msg.timestamp as Date).toISOString(),
            })),
          };
        } else if (block.type === 'Practice' && block.practiceBlock) {
          return {
            id: block.id,
            sessionId: block.sessionId,
            orderIndex: block.orderIndex,
            alreadyViewed: block.alreadyViewed,
            type: 'Practice' as const,
            content: {
              blockId: block.practiceBlock.blockId,
              soloLevel: block.practiceBlock.soloLevel,
              question: block.practiceBlock.question,
              answerOptions: block.practiceBlock.answerOptions,
              correctAnswerOptionIndices: block.practiceBlock.correctAnswerOptionIndices,
              studentAnswerOptionIndices: block.practiceBlock.studentAnswerOptionIndices,
              studentAnswerIsCorrect: block.practiceBlock.studentAnswerIsCorrect,
            },
          };
        } else {
          return {
            id: block.id,
            sessionId: block.sessionId,
            orderIndex: block.orderIndex,
            alreadyViewed: block.alreadyViewed,
            type: 'Summary' as const,
            content: {
              blockId: block.summaryBlock!.blockId,
              sessionSummary: block.summaryBlock!.sessionSummary,
            },
          };
        }
      }),
    };
  }
}
