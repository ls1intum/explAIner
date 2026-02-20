import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { GetSessionResponseDto } from '../dto/response/get-session.response.dto';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import { mapSessionToGetResponse } from '../utils/session-mapper.utils';

@Injectable()
export class GetSessionService {
  constructor(private prisma: PrismaService) {}

  /** Get session by ID with all blocks (rehydrate frontend on reload). */
  @LogService()
  async getById(sessionId: string): Promise<GetSessionResponseDto> {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        blocks: {
          orderBy: { orderIndex: 'asc' },
          include: {
            informBlock: {
              include: { messages: { orderBy: { timestamp: 'asc' } } },
            },
            practiceBlock: true,
            summaryBlock: true,
          },
        },
      },
    });
    if (!session) throw new NotFoundException(`Session with ID ${sessionId} not found`);
    return mapSessionToGetResponse(session) as GetSessionResponseDto;
  }
}
