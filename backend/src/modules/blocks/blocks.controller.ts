import { Controller, Get, Post, Patch, Body, Param, HttpCode } from '@nestjs/common';
import { GetBlockByOrderIndexService } from './services/get-block-by-order-index.service';
import { GenerateBlockSequenceService } from './services/generate-block-sequence.service';
import { GenerateSummaryBlockService } from './services/generate-summary-block.service';
import { SendMessageService } from './services/send-message.service';
import { SubmitAnswerService } from './services/submit-answer.service';
import { SendMessageRequestDto } from './dto/send-message.request.dto';
import { SubmitAnswerRequestDto } from './dto/submit-answer.request.dto';
import { GenerateBlockSequenceResponseDto } from './dto/generate-block-sequence.response.dto';
import { GenerateSummaryResponseDto } from './dto/generate-summary.response.dto';

@Controller('sessions/:sessionId/blocks')
export class BlocksController {
  constructor(
    private readonly generateBlockSequenceService: GenerateBlockSequenceService,
    private readonly generateSummaryBlockService: GenerateSummaryBlockService,
    private readonly getBlockByOrderIndexService: GetBlockByOrderIndexService,
    private readonly sendMessageService: SendMessageService,
    private readonly submitAnswerService: SubmitAnswerService,
  ) {}

  @Post('sequence')
  generateSequence(@Param('sessionId') sessionId: string): Promise<GenerateBlockSequenceResponseDto> {
    // Mode is automatically detected inside the service based on session state
    return this.generateBlockSequenceService.generate(sessionId);
  }

  @Post('summary')
  generateSummary(@Param('sessionId') sessionId: string): Promise<GenerateSummaryResponseDto> {
    return this.generateSummaryBlockService.generate(sessionId);
  }

  @Get(':orderIndex')
  getBlock(
    @Param('sessionId') sessionId: string,
    @Param('orderIndex') orderIndex: string,
  ) {
    return this.getBlockByOrderIndexService.getBlock(sessionId, parseInt(orderIndex));
  }

  @Post(':orderIndex/send-message')
  sendMessage(
    @Param('sessionId') sessionId: string,
    @Param('orderIndex') orderIndex: string,
    @Body() dto: SendMessageRequestDto,
  ) {
    return this.sendMessageService.send(sessionId, orderIndex, dto);
  }

  @Patch(':orderIndex/submit-answer')
  @HttpCode(204)
  submitAnswer(
    @Param('sessionId') sessionId: string,
    @Param('orderIndex') orderIndex: string,
    @Body() dto: SubmitAnswerRequestDto,
  ): Promise<void> {
    return this.submitAnswerService.submit(sessionId, orderIndex, dto);
  }
}
