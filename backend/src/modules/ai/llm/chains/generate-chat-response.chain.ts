import { Injectable, Logger } from '@nestjs/common';
import { LlmService } from '../llm.service';
import { Parser } from '../llm.parser';
import { generateChatResponsePrompt } from '../prompts/generate-chat-response.prompt';
import {
  followUpAnswerMessageSchema,
  type FollowUpAnswerMessage,
} from '../../../../domain/schemas/blocks/inform/inform-block-messages/follow_up_answer-message.schema';
import { isLogEnabled } from '../../../../config/logging.config';

/**
 * Chain for generating chat responses. Orchestrates: Prompt -> LLM Call -> Parse -> Validate
 */
@Injectable()
export class GenerateChatResponseChain {
  private readonly logger = new Logger('AI-CHAIN');
  private parser: Parser<FollowUpAnswerMessage>;

  constructor(private llmService: LlmService) {
    this.parser = new Parser(followUpAnswerMessageSchema, async (error: string) => {
      const fixPrompt = `Your previous response failed validation with this error: ${error}. Please return a valid JSON response matching the required format.`;
      return this.llmService.callClaude(fixPrompt);
    });
  }

  async execute(params: {
    topic: string;
    learningGoal: string;
    bloomsLevel: string;
    userMessage: string;
    conversationHistory?: string;
  }): Promise<FollowUpAnswerMessage> {
    if (isLogEnabled('ai')) {
      this.logger.log('generate-chat-response');
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

    // 3. Parse and validate response (with retry on schema/parse failure)
    const chatResponse = await this.parser.parseWithRetry(rawResponse);

    return chatResponse;
  }
}
