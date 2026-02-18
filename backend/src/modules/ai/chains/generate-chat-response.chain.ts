import { Injectable } from '@nestjs/common';
import { LlmService } from '../llm.service';
import { Parser } from '../llm.parser';
import { generateChatResponsePrompt } from '../prompts/generate-chat-response.prompt';
import { chatResponseSchema, type ChatResponse } from '../schemas/chat-response.schema';
import { logAiChain } from '../../../common/utils/logging.utils';
import { isLogEnabled } from '../../../config/logging.config';

/**
 * Chain for generating chat responses
 * Orchestrates: Prompt -> AI Call -> Parse -> Validate
 */
@Injectable()
export class GenerateChatResponseChain {
  private parser = new Parser(chatResponseSchema);

  constructor(private llmService: LlmService) {}

  async execute(params: {
    topic: string;
    learningGoal: string;
    bloomsLevel: string;
    userMessage: string;
    conversationHistory?: string;
  }): Promise<ChatResponse> {
    // Log chain execution
    if (isLogEnabled('ai')) {
      logAiChain('generate-chat-response');
    }

    // 1. Generate prompt with conversation context
    const prompt = generateChatResponsePrompt({
      topic: params.topic,
      learningGoal: params.learningGoal,
      bloomsLevel: params.bloomsLevel,
      currentBlockContext: params.conversationHistory 
        ? `${params.conversationHistory}\n\nUser: ${params.userMessage}` 
        : `User: ${params.userMessage}`,
    });

    // 2. Call Claude
    const rawResponse = await this.llmService.callClaude(prompt);

    // 3. Parse and validate response
    const chatResponse = this.parser.parse(rawResponse);

    return chatResponse;
  }
}
