import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { GetBlockByOrderIndexService } from './services/get-block-by-order-index.service';
import { GenerateSubsequentBlockSequenceService } from './services/generate-subsequent-block-sequence.service';
import { GenerateSummaryBlockService } from './services/generate-summary-block.service';
import { SendMessageService } from './services/send-message.service';
import { CheckAnswerService } from './services/check-answer.service';
import { GenerateSubsequentSequenceDto } from './dto/generate-subsequent-sequence.dto';
import { GenerateSummaryDto } from './dto/generate-summary.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { CheckAnswerDto } from './dto/check-answer.dto';

@Controller('sessions/:sessionId/blocks')
export class BlocksController {
  constructor(
    private readonly getBlockByOrderIndexService: GetBlockByOrderIndexService,
    private readonly generateSubsequentBlockSequenceService: GenerateSubsequentBlockSequenceService,
    private readonly generateSummaryBlockService: GenerateSummaryBlockService,
    private readonly sendMessageService: SendMessageService,
    private readonly checkAnswerService: CheckAnswerService,
  ) {}

  @Get(':orderIndex')
  getBlock(
    @Param('sessionId') sessionId: string,
    @Param('orderIndex') orderIndex: string,
  ) {
    return this.getBlockByOrderIndexService.getBlock(sessionId, parseInt(orderIndex));
  }

  @Post('next-sequence')
  generateNextSequence(
    @Param('sessionId') sessionId: string,
    @Body() dto: GenerateSubsequentSequenceDto,
  ) {
    return this.generateSubsequentBlockSequenceService.generate(dto);
  }

  @Post('summary')
  generateSummary(
    @Param('sessionId') sessionId: string,
    @Body() dto: GenerateSummaryDto,
  ) {
    return this.generateSummaryBlockService.generate(dto);
  }

  @Post(':orderIndex/send-message')
  sendMessage(
    @Param('sessionId') sessionId: string,
    @Param('orderIndex') orderIndex: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.sendMessageService.send(sessionId, orderIndex, dto);
  }

  @Patch(':orderIndex/check-answer')
  checkAnswer(
    @Param('sessionId') sessionId: string,
    @Param('orderIndex') orderIndex: string,
    @Body() dto: CheckAnswerDto,
  ) {
    return this.checkAnswerService.check(sessionId, orderIndex, dto);
  }
}
