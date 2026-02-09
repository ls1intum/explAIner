import { Controller, Get, Post, Patch, Body, Param, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { GetBlockByOrderIndexService } from './services/get-block-by-order-index.service';
import { GenerateBlockSequenceService } from './services/generate-block-sequence.service';
import { GenerateSummaryBlockService } from './services/generate-summary-block.service';
import { SendMessageService } from './services/send-message.service';
import { SubmitAnswerService } from './services/submit-answer.service';
import { SendMessageRequestDto } from './dto/request/send-message.request.dto';
import { SubmitAnswerRequestDto } from './dto/request/submit-answer.request.dto';
import { GenerateBlockSequenceResponseDto } from './dto/response/generate-block-sequence.response.dto';
import { GenerateSummaryResponseDto } from './dto/response/generate-summary.response.dto';
import { GetBlockResponseDto } from './dto/response/get-block-by-order-index.response.dto';
import { SendMessageResponseDto } from './dto/response/send-message.response.dto';

@ApiTags('blocks')
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
  @ApiOperation({ summary: 'Generate block sequence', description: 'Generates next block sequence (1 inform + 3 practice blocks). Mode ("INITIAL" for first block sequence, "SUBSEQUENT" for subsequent block sequences) is automatically detected based on session state.' })
  @ApiParam({ name: 'sessionId', description: 'Unique session identifier' })
  @ApiResponse({ status: 201, description: 'Block sequence generated successfully', type: GenerateBlockSequenceResponseDto })
  @ApiResponse({ status: 404, description: 'Session not found' })
  generateSequence(@Param('sessionId') sessionId: string): Promise<GenerateBlockSequenceResponseDto> {
    // Mode is automatically detected inside the service based on session state
    return this.generateBlockSequenceService.generate(sessionId);
  }

  @Post('summary')
  @ApiOperation({ summary: 'Generate summary block', description: 'Generates a summary block for the session with learning outcomes and performance summary' })
  @ApiParam({ name: 'sessionId', description: 'Unique session identifier' })
  @ApiResponse({ status: 201, description: 'Summary block generated successfully', type: GenerateSummaryResponseDto })
  @ApiResponse({ status: 404, description: 'Session not found' })
  generateSummary(@Param('sessionId') sessionId: string): Promise<GenerateSummaryResponseDto> {
    return this.generateSummaryBlockService.generate(sessionId);
  }

  @Get(':orderIndex')
  @ApiOperation({ summary: 'Get block by order index', description: 'Retrieves a specific block by its order index within the session' })
  @ApiParam({ name: 'sessionId', description: 'Unique session identifier' })
  @ApiParam({ name: 'orderIndex', description: 'Block order index (0-based)' })
  @ApiResponse({ status: 200, description: 'Block found', type: GetBlockResponseDto })
  @ApiResponse({ status: 404, description: 'Block not found' })
  getBlock(
    @Param('sessionId') sessionId: string,
    @Param('orderIndex') orderIndex: string,
  ) {
    return this.getBlockByOrderIndexService.getBlock(sessionId, parseInt(orderIndex));
  }

  @Post(':orderIndex/messages')
  @ApiOperation({ summary: 'Send message in inform block', description: 'Sends a chat message to an inform block and receives AI response from Owlbert' })
  @ApiParam({ name: 'sessionId', description: 'Unique session identifier' })
  @ApiParam({ name: 'orderIndex', description: 'Block order index (0-based)' })
  @ApiBody({ type: SendMessageRequestDto })
  @ApiResponse({ status: 201, description: 'Message sent and response received', type: SendMessageResponseDto })
  @ApiResponse({ status: 404, description: 'Block not found' })
  sendMessage(
    @Param('sessionId') sessionId: string,
    @Param('orderIndex') orderIndex: string,
    @Body() dto: SendMessageRequestDto,
  ) {
    return this.sendMessageService.send(sessionId, orderIndex, dto);
  }

  @Patch(':orderIndex/student-answer')
  @HttpCode(204)
  @ApiOperation({ summary: 'Submit answer for practice block', description: 'Persists student answer in database' })
  @ApiParam({ name: 'sessionId', description: 'Unique session identifier' })
  @ApiParam({ name: 'orderIndex', description: 'Block order index (0-based)' })
  @ApiBody({ type: SubmitAnswerRequestDto })
  @ApiResponse({ status: 204, description: 'Answer persisted successfully (no content)' })
  @ApiResponse({ status: 404, description: 'Practice block not found' })
  submitAnswer(
    @Param('sessionId') sessionId: string,
    @Param('orderIndex') orderIndex: string,
    @Body() dto: SubmitAnswerRequestDto,
  ): Promise<void> {
    return this.submitAnswerService.submit(sessionId, orderIndex, dto);
  }
}
