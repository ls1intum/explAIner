import { Module } from '@nestjs/common';
import { LlmService } from './llm.service';
import { GenerateLearningGoalsChain } from './chains/generate-learning-goals.chain';
import { GenerateEasierLearningGoalsChain } from './chains/generate-easier-learning-goals.chain';
import { GenerateBlockSequenceChain } from './chains/generate-block-sequence.chain';
import { GenerateChatResponseChain } from './chains/generate-chat-response.chain';
import { GenerateSessionSummaryChain } from './chains/generate-session-summary.chain';

// LLM Module: Provides shared LLM services and chains for other modules
@Module({
  providers: [
    LlmService,
    GenerateLearningGoalsChain,
    GenerateEasierLearningGoalsChain,
    GenerateBlockSequenceChain,
    GenerateChatResponseChain,
    GenerateSessionSummaryChain,
  ],
  exports: [
    LlmService,
    GenerateLearningGoalsChain,
    GenerateEasierLearningGoalsChain,
    GenerateBlockSequenceChain,
    GenerateChatResponseChain,
    GenerateSessionSummaryChain,
  ],
})
export class LlmModule {}
