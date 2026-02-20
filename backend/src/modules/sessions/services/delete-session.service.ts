import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import { DeleteSessionResponseDto } from '../dto/response/delete-session.response.dto';
import { mapDeleteSessionResponse } from '../session.utils';

@Injectable()
export class DeleteSessionService {
  constructor(private prisma: PrismaService) {}

  /**
   * Delete session and all related data (cascade delete)
   * Deletes: Session -> Blocks -> InformBlocks -> InformBlockMessages, PracticeBlocks, SummaryBlocks
   */
  @LogService()
  async delete(sessionId: string): Promise<DeleteSessionResponseDto> {

    // 1. Check if session exists
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${sessionId} not found`);
    }

    // 2. Delete session (cascade will delete all related blocks and their data)
    await this.prisma.session.delete({
      where: { id: sessionId },
    });

    return mapDeleteSessionResponse();
  }
}
