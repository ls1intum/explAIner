import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { GetSessionResponseDto } from '../dto/response/get-session.response.dto';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import { getSessionWithAllBlocks, mapSessionToGetResponse, requireSessionExists} from '../session.utils';

/** Service fetching entire session data incl. all blocks (e.g. for frontend rehydration on page reload) */
@Injectable()
export class GetSessionService {
  constructor(private prisma: PrismaService) {}

  @LogService()
  async getById(sessionId: string): Promise<GetSessionResponseDto> {

    // Ensure session exists
    await requireSessionExists(this.prisma, sessionId);

    // Fetch session data
    const session = await getSessionWithAllBlocks(this.prisma, sessionId);

    // Return response
    return mapSessionToGetResponse(session) as GetSessionResponseDto;
  }
}
