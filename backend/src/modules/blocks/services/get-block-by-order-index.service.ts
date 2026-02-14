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
        informBlockMessages: {
          orderBy: { timestamp: 'asc' },
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

    // Return block in frontend-compatible format
    return {
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
        timestamp: msg.timestamp.toISOString(),
      })),
      practiceBlock: block.practiceBlock ?? undefined,
      summaryBlock: block.summaryBlock ?? undefined,
    };
  }
}
