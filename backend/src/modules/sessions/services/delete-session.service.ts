import { Injectable } from '@nestjs/common';

@Injectable()
export class DeleteSessionService {
  async delete(sessionId: string): Promise<{ success: boolean }> {
    // Implementation: Delete session from database
    return { success: true };
  }
}
