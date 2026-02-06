import { Module } from '@nestjs/common';
import { BlocksController } from './blocks.controller';
import { SubmitAnswerService } from './services/submit-answer.service';
import { GenerateBlockSequenceService } from './services/generate-block-sequence.service';
import { GenerateSummaryBlockService } from './services/generate-summary-block.service';
import { GetBlockByOrderIndexService } from './services/get-block-by-order-index.service';
import { SendMessageService } from './services/send-message.service';
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
    SendMessageService,
  ],
  exports: [
    SubmitAnswerService,
    GenerateBlockSequenceService,
    GenerateSummaryBlockService,
    GetBlockByOrderIndexService,
    SendMessageService,
  ],
})
export class BlocksModule {}
