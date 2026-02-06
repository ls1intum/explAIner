import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { GenerateLearningGoalsChain } from './chains/generate-learning-goals.chain';
import { GenerateBlockSequenceChain } from './chains/generate-block-sequence.chain';
import { GenerateInformBlockChatResponseChain } from './chains/generate-inform-block-chat-response.chain';
import { GenerateSummaryBlockChain } from './chains/generate-summary-block.chain';

// AI Module: Infrastructure layer providing AI services and chains
// No controllers - this is not a feature module, but infrastructure used by other modules
@Module({
  providers: [
    AiService,
    GenerateLearningGoalsChain,
    GenerateBlockSequenceChain,
    GenerateInformBlockChatResponseChain,
    GenerateSummaryBlockChain,
  ],
  exports: [
    AiService,
    GenerateLearningGoalsChain,
    GenerateBlockSequenceChain,
    GenerateInformBlockChatResponseChain,
    GenerateSummaryBlockChain,
  ],
})
export class AiModule {}
