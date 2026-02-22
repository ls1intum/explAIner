import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import { DeleteSessionResponseDto } from '../dto/response/delete-session.response.dto';
import { requireSessionExists } from '../session.utils';

/** Service deleting a session (removes all blocks and entire data) */
@Injectable()
export class DeleteSessionService {
  constructor(private prisma: PrismaService) {}

  @LogService()
  async delete(sessionId: string): Promise<DeleteSessionResponseDto> {

    // Ensure session exists
    await requireSessionExists(this.prisma, sessionId);

    // Delete session
    await this.prisma.session.delete({
      where: { id: sessionId },
    });

    // Return response
    return { success: true as const };
  }
}
