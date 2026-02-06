import { Injectable } from '@nestjs/common';
import { AiService } from '../ai.service';
import { ChatResponseParser } from '../parsers/chat-response.parser';
import { generateInformBlockChatResponsePrompt } from '../prompts/generate-inform-block-chat-response.prompt';
import type { ChatResponse } from '../schemas/chat-response.schema';

/**
 * Chain for generating inform block chat responses
 * Orchestrates: Prompt -> AI Call -> Parse -> Validate
 */
@Injectable()
export class GenerateInformBlockChatResponseChain {
  private parser = new ChatResponseParser();

  constructor(private aiService: AiService) {}

  async execute(params: {
    topic: string;
    learningGoal: string;
    bloomsLevel: string;
    userMessage: string;
    conversationHistory?: string;
  }): Promise<ChatResponse> {
    // 1. Generate prompt with conversation context
    // Appends user message to history (if exists) to maintain context
    const prompt = generateInformBlockChatResponsePrompt({
      topic: params.topic,
      learningGoal: params.learningGoal,
      bloomsLevel: params.bloomsLevel,
      currentBlockContext: params.conversationHistory 
        ? `${params.conversationHistory}\n\nUser: ${params.userMessage}` 
        : `User: ${params.userMessage}`,
    });

    // 2. Call Claude
    const rawResponse = await this.aiService.callClaude(
      prompt,
      'generate-inform-block-chat-response.prompt.ts',
    );

    // 3. Parse and validate response
    const chatResponse = this.parser.parse(rawResponse);

    return chatResponse;
  }
}
