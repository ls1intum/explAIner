import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import { DeleteSessionResponseDto } from '../dto/response/delete-session.response.dto';
import { requireSessionExists } from '../session.utils';

/** Deletes a session; Prisma cascade removes all blocks and related data. */
@Injectable()
export class DeleteSessionService {
  constructor(private prisma: PrismaService) {}

  @LogService()
  async delete(sessionId: string): Promise<DeleteSessionResponseDto> {

    // Check if session exists
    await requireSessionExists(this.prisma, sessionId);

    // Delete session
    await this.prisma.session.delete({
      where: { id: sessionId },
    });

    // Return response
    return { success: true as const };
  }
}
