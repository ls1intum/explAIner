import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { GetBlockResponseDto } from '../dto/response/get-block-by-order-index.response.dto';
import { LogService } from '../../../common/decorators/service-logging.decorator';

@Injectable()
export class GetBlockByOrderIndexService {
  constructor(private prisma: PrismaService) {}

  @LogService()
  async getBlock(sessionId: string, orderIndex: number): Promise<GetBlockResponseDto> {
    // Query database for block by session ID and order index
    const block = await this.prisma.block.findUnique({
      where: {
        sessionId_orderIndex: {
          sessionId,
          orderIndex,
        },
      },
      include: {
        informBlock: {
          include: {
            messages: { orderBy: { timestamp: 'asc' } },
          },
        },
        practiceBlock: true,
        summaryBlock: true,
      },
    });

    if (!block) {
      throw new NotFoundException(
        `Block not found for session ${sessionId} at order index ${orderIndex}`,
      );
    }

    // Return block in schema-compatible format (discriminated union with content field)
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
          timestamp: msg.timestamp.toISOString(),
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
    } else if (block.type === 'Summary' && block.summaryBlock) {
      return {
        id: block.id,
        sessionId: block.sessionId,
        orderIndex: block.orderIndex,
        alreadyViewed: block.alreadyViewed,
        type: 'Summary' as const,
        content: {
          blockId: block.summaryBlock.blockId,
          sessionSummary: block.summaryBlock.sessionSummary,
        },
      };
    }

    throw new NotFoundException(`Invalid block type or missing block content`);
  }
}
