import { Injectable } from '@nestjs/common';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import { DeleteSessionResponseDto } from '../dto/response/delete-session.response.dto';
import { SessionsRepository } from '../../shared/database/repositories/sessions.repository';

/** Service deleting a session (removes all blocks and entire data) */
@Injectable()
export class DeleteSessionService {
  constructor(private sessionsRepository: SessionsRepository) {}

  @LogService()
  async delete(sessionId: string): Promise<DeleteSessionResponseDto> {

    // Ensure session exists
    await this.sessionsRepository.requireSessionExists(sessionId);

    // Delete session
    await this.sessionsRepository.delete(sessionId);

    // Return response
    return { success: true as const };
  }
}
