import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import { DeleteSessionResponseDto } from '../dto/delete-session.response.dto';

@Injectable()
export class DeleteSessionService {
  constructor(private prisma: PrismaService) {}

  /**
   * Delete session and all related data (cascade delete)
   * Deletes: Session -> Blocks -> InformBlockMessages, PracticeBlocks, SummaryBlocks
   */
  @LogService()
  async delete(sessionId: string): Promise<DeleteSessionResponseDto> {
    // Check if session exists
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${sessionId} not found`);
    }

    // Delete session (cascade will delete all related blocks and their data)
    await this.prisma.session.delete({
      where: { id: sessionId },
    });

    return { success: true };
  }
}
