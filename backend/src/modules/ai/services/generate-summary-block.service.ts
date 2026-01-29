import { Injectable } from '@nestjs/common';

@Injectable()
export class GenerateSummaryBlockService {
  /**
   * Generate summary block for session completion
   */
  async generate(sessionId: string) {
    // Implementation using prompt, chain, and parser
    return { sessionSummary: '' };
  }
}
