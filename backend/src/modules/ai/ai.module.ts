import { Module } from '@nestjs/common';
import { LlmService } from './llm.service';
import { GenerateLearningGoalsChain } from './chains/generate-learning-goals.chain';
import { GenerateEasierLearningGoalsChain } from './chains/generate-easier-learning-goals.chain';
import { GenerateBlockSequenceChain } from './chains/generate-block-sequence.chain';
import { GenerateChatResponseChain } from './chains/generate-chat-response.chain';
import { GenerateSessionSummaryChain } from './chains/generate-session-summary.chain';

// AI Module: Infrastructure layer providing AI services and chains
// No controllers - this is not a feature module, but infrastructure used by other modules
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
export class AiModule {}
