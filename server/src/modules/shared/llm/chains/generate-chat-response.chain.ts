import { Injectable, Logger } from '@nestjs/common';
import { LlmService } from '../llm.service';
import { generateChatResponsePrompt } from '../prompts/generate-chat-response.prompt';
import {
  FollowUpAnswerMessageDtoSchema,
  type FollowUpAnswerMessage,
} from '../../../../domain/schemas/dto/blocks.schema';
import { isLogEnabled } from '../../../../config/logging.config';

/** Chain generating a chat response to user follow-up question on inform block */
@Injectable()
export class GenerateChatResponseChain {
  private readonly logger = new Logger('AI-CHAIN');

  constructor(private llmService: LlmService) {}

  async execute(params: {
    topic: string;
    learningGoal: string;
    bloomsLevel: string;
    userMessage: string;
    conversationHistory?: string;
    lang?: string | null;
    referenceKnowledge?: string | null;
  }): Promise<FollowUpAnswerMessage> {
    if (isLogEnabled('ai-chain')) {
      this.logger.log('generate-chat-response');
    }

    // Generate prompt (incl. conversation context)
    const prompt = generateChatResponsePrompt({
      topic: params.topic,
      learningGoal: params.learningGoal,
      bloomsLevel: params.bloomsLevel,
      currentBlockContext: params.conversationHistory
        ? `${params.conversationHistory}\n\nUser: ${params.userMessage}`
        : `User: ${params.userMessage}`,
      lang: params.lang,
      referenceKnowledge: params.referenceKnowledge,
    });

    // Call LLM with prompt
    const llmResponse = await this.llmService.callClaude(prompt);

    // Parse LLM output against schema and return response
    return this.llmService.createParser(FollowUpAnswerMessageDtoSchema).parse(llmResponse);
  }
}
