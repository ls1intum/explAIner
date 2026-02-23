import { Injectable } from '@nestjs/common';
import { SessionsRepository } from '../../shared/database/sessions.repository';
import { GetSessionResponseDto } from '../dto/response/get-session.response.dto';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import { mapToGetSessionResponseDto } from '../session.utils';

/** Service fetching entire session data incl. all blocks (e.g. for frontend rehydration on page reload) */
@Injectable()
export class GetSessionService {
  constructor(private sessionsRepository: SessionsRepository) {}

  @LogService()
  async getById(sessionId: string): Promise<GetSessionResponseDto> {

    // Ensure session exists
    await this.sessionsRepository.requireSessionExists(sessionId);

    // Fetch session data
    const session = await this.sessionsRepository.getSessionWithAllBlocks(sessionId);

    // Return response
    return mapToGetSessionResponseDto(session) as GetSessionResponseDto;
  }
}
