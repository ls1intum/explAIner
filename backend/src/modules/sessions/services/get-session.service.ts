import { Injectable } from '@nestjs/common';
import { SessionResponseDto } from '../dto/session-response.dto';

@Injectable()
export class GetSessionService {
  async getById(sessionId: string): Promise<SessionResponseDto> {
    // Implementation: Query database for session
    return {} as SessionResponseDto;
  }
}
