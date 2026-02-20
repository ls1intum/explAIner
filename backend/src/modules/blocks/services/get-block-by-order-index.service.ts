import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { BlockSchema } from '../../../domain/schemas/base/block.schema';
import { GetBlockResponseDto } from '../dto/response/get-block-by-order-index.response.dto';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import { blockToResponse } from '../block.utils';

@Injectable()
export class GetBlockByOrderIndexService {
  constructor(private prisma: PrismaService) {}

  @LogService()
  async getBlock(sessionId: string, orderIndex: number): Promise<GetBlockResponseDto> {
    const block = await this.prisma.block.findUnique({
      where: {
        sessionId_orderIndex: { sessionId, orderIndex },
      },
      include: {
        informBlock: {
          include: { messages: { orderBy: { timestamp: 'asc' } } },
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
    try {
      const raw = blockToResponse(block);
      return BlockSchema.parse(raw);
    } catch {
      throw new NotFoundException('Invalid block type or missing block content');
    }
  }
}
