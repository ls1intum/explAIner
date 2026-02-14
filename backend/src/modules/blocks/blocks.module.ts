import { Module } from '@nestjs/common';
import { BlocksController } from './blocks.controller';
import { SubmitAnswerService } from './services/submit-answer.service';
import { GenerateBlockSequenceService } from './services/generate-block-sequence.service';
import { GenerateSummaryBlockService } from './services/generate-summary-block.service';
import { GetBlockByOrderIndexService } from './services/get-block-by-order-index.service';
import { GenerateChatResponseService } from './services/generate-chat-response.service';
import { AiModule } from '../ai/ai.module';

// Blocks Module: Handles all block-related operations (CRUD, generation, interaction)
@Module({
  imports: [AiModule],
  controllers: [BlocksController],
  providers: [
    SubmitAnswerService,
    GenerateBlockSequenceService,
    GenerateSummaryBlockService,
    GetBlockByOrderIndexService,
    GenerateChatResponseService,
  ],
  exports: [
    SubmitAnswerService,
    GenerateBlockSequenceService,
    GenerateSummaryBlockService,
    GetBlockByOrderIndexService,
    GenerateChatResponseService,
  ],
})
export class BlocksModule {}
