import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import { UpdateCurrentBlockIndexResponseDto } from '../dto/response/update-current-block-index.response.dto';
import { requireSessionExists } from '../session.utils';

/** Updates the session's current block index and marks that block as viewed. */
@Injectable()
export class UpdateCurrentBlockIndexService {
  constructor(private prisma: PrismaService) {}

  @LogService()
  async updateCurrentBlockIndex(
    sessionId: string,
    currentBlockIndex: number,
  ): Promise<UpdateCurrentBlockIndexResponseDto> {

    // Ensure session exists
    await requireSessionExists(this.prisma, sessionId);

    // Atomic: both updates commit together or roll back
    await this.prisma.$transaction([

      // Update current block index
      this.prisma.session.update({
        where: { id: sessionId },
        data: { currentBlockIndex },
      }),
      
      // Set already_viewed flag for current block
      this.prisma.block.updateMany({
        where: { sessionId, orderIndex: currentBlockIndex },
        data: { alreadyViewed: true },
      }),
    ]);

    return { success: true as const, currentBlockIndex };
  }
}
