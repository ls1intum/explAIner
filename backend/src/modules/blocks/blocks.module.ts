import { Module } from '@nestjs/common';
import { BlocksController } from './blocks.controller';
import { CheckAnswerService } from './services/check-answer.service';
import { GenerateSubsequentBlockSequenceService } from './services/generate-subsequent-block-sequence.service';
import { GenerateSummaryBlockService } from './services/generate-summary-block.service';
import { GetBlockByOrderIndexService } from './services/get-block-by-order-index.service';
import { SendMessageService } from './services/send-message.service';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],
  controllers: [BlocksController],
  providers: [
    CheckAnswerService,
    GenerateSubsequentBlockSequenceService,
    GenerateSummaryBlockService,
    GetBlockByOrderIndexService,
    SendMessageService,
  ],
  exports: [
    CheckAnswerService,
    GenerateSubsequentBlockSequenceService,
    GenerateSummaryBlockService,
    GetBlockByOrderIndexService,
    SendMessageService,
  ],
})
export class BlocksModule {}
