import { Module } from '@nestjs/common';
import { LlmService } from './llm.service';
import { GenerateLearningGoalsChain } from './chains/generate-learning-goals.chain';
import { GenerateEasierLearningGoalsChain } from './chains/generate-easier-learning-goals.chain';
import { GenerateBlockSequenceChain } from './chains/generate-block-sequence.chain';
import { GenerateChatResponseChain } from './chains/generate-chat-response.chain';
import { GenerateSessionSummaryChain } from './chains/generate-session-summary.chain';

// LLM Module: Infrastructure providing LLM services and chains (used by blocks, learning-goals)
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
