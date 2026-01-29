import { Injectable } from '@nestjs/common';

@Injectable()
export class GenerateInformBlockChatResponseService {
  /**
   * Generate chat response for inform block follow-up questions
   */
  async generate(params: {
    sessionId: string;
    blockId: string;
    userMessage: string;
  }) {
    // Implementation using prompt, chain, and parser
    return { response: '' };
  }
}
