import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { GenerateLearningGoalsChain } from './chains/generate-learning-goals.chain';
import { GenerateEasierLearningGoalsChain } from './chains/generate-easier-learning-goals.chain';
import { GenerateInitialBlockSequenceChain } from './chains/generate-initial-block-sequence.chain';
import { GenerateSubsequentBlockSequenceChain } from './chains/generate-subsequent-block-sequence.chain';
import { GenerateChatResponseChain } from './chains/generate-chat-response.chain';
import { GenerateSummaryBlockChain } from './chains/generate-summary-block.chain';

// AI Module: Infrastructure layer providing AI services and chains
// No controllers - this is not a feature module, but infrastructure used by other modules
@Module({
  providers: [
    AiService,
    GenerateLearningGoalsChain,
    GenerateEasierLearningGoalsChain,
    GenerateInitialBlockSequenceChain,
    GenerateSubsequentBlockSequenceChain,
    GenerateChatResponseChain,
    GenerateSummaryBlockChain,
  ],
  exports: [
    AiService,
    GenerateLearningGoalsChain,
    GenerateEasierLearningGoalsChain,
    GenerateInitialBlockSequenceChain,
    GenerateSubsequentBlockSequenceChain,
    GenerateChatResponseChain,
    GenerateSummaryBlockChain,
  ],
})
export class AiModule {}
