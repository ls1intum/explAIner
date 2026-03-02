import { Module } from '@nestjs/common';
import { BlocksController } from './blocks.controller';
import { SubmitAnswerService } from './services/submit-answer.service';
import { GenerateBlockSequenceService } from './services/generate-block-sequence.service';
import { GenerateSummaryBlockService } from './services/generate-summary-block.service';
import { GetBlockService } from './services/get-block.service';
import { GenerateChatResponseService } from './services/generate-chat-response.service';
import { LlmModule } from '../shared/llm/llm.module';
import { PrismaModule } from 'prisma/prisma.module';
import { DatabaseModule } from '../shared/database/database.module';

// Blocks Module: Handles all block(sequence) related operations (CRUD, generation, interaction)
@Module({
  imports: [PrismaModule, DatabaseModule, LlmModule],
  controllers: [BlocksController],
  providers: [
    SubmitAnswerService,
    GenerateBlockSequenceService,
    GenerateSummaryBlockService,
    GetBlockService,
    GenerateChatResponseService,
  ],
  exports: [
    SubmitAnswerService,
    GenerateBlockSequenceService,
    GenerateSummaryBlockService,
    GetBlockService,
    GenerateChatResponseService,
  ],
})
export class BlocksModule {}
