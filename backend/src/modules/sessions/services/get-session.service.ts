import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { GetSessionResponseDto } from '../dto/response/get-session.response.dto';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import { getSessionWithAllBlocks, mapSessionToGetResponse } from '../session.utils';

/** Loads a session with all blocks for frontend rehydration (e.g. on page reload). */
@Injectable()
export class GetSessionService {
  constructor(private prisma: PrismaService) {}

  @LogService()
  async getById(sessionId: string): Promise<GetSessionResponseDto> {
    const session = await getSessionWithAllBlocks(this.prisma, sessionId);
    return mapSessionToGetResponse(session) as GetSessionResponseDto;
  }
}
