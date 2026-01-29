import { Injectable } from '@nestjs/common';
import { SendMessageDto } from '../dto/send-message.dto';
import { MessageResponseDto } from '../dto/message-response.dto';

@Injectable()
export class SendMessageService {
  async send(sessionId: string, blockId: string, dto: SendMessageDto): Promise<MessageResponseDto> {
    // Implementation:
    // 1. Store user message in inform_block_messages
    // 2. Call AI service: generate-inform-block-chat-response.service.ts
    // 3. Store Owlbert response in inform_block_messages
    // 4. Return the response
    return {} as MessageResponseDto;
  }
}
