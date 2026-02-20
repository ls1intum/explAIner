import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import { UpdateCurrentBlockIndexResponseDto } from '../dto/response/update-current-block-index.response.dto';
import { mapUpdateCurrentBlockIndexResponse } from '../session.utils';

@Injectable()
export class UpdateCurrentBlockIndexService {
  constructor(private prisma: PrismaService) {}

  /**
   * Update current block index for a session
   * Also marks the block as viewed in the database
   */
  @LogService()
  async updateCurrentBlockIndex(sessionId: string, currentBlockIndex: number): Promise<UpdateCurrentBlockIndexResponseDto> {
    
    // 1. Validate session exists
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });
    if (!session) {
      throw new NotFoundException(`Session with ID ${sessionId} not found`);
    }

    // 2. Update current block index
    await this.prisma.session.update({
      where: { id: sessionId },
      data: { currentBlockIndex },
    });

    // 3. Mark the block as viewed in the database
    await this.prisma.block.updateMany({
      where: {
        sessionId,
        orderIndex: currentBlockIndex,
      },
      data: {
        alreadyViewed: true,
      },
    });

    return mapUpdateCurrentBlockIndexResponse(currentBlockIndex);
  }
}
