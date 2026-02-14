import { Controller, Get, Post, Patch, Put, Body, Param, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { GetBlockByOrderIndexService } from './services/get-block-by-order-index.service';
import { GenerateBlockSequenceService } from './services/generate-block-sequence.service';
import { GenerateSummaryBlockService } from './services/generate-summary-block.service';
import { GenerateChatResponseService } from './services/generate-chat-response.service';
import { SubmitAnswerService } from './services/submit-answer.service';
import { GenerateChatResponseRequestDto } from './dto/request/generate-chat-response.request.dto';
import { SubmitAnswerRequestDto } from './dto/request/submit-answer.request.dto';
import { GenerateBlockSequenceRequestDto } from './dto/request/generate-block-sequence.request.dto';
import { GenerateSummaryBlockRequestDto } from './dto/request/generate-summary-block.request.dto';
import { GetBlockByOrderIndexRequestDto } from './dto/request/get-block-by-order-index.request.dto';
import { GenerateBlockSequenceResponseDto } from './dto/response/generate-block-sequence.response.dto';
import { GenerateSummaryBlockResponseDto } from './dto/response/generate-summary-block.response.dto';
import { GetBlockResponseDto } from './dto/response/get-block-by-order-index.response.dto';
import { GenerateChatResponseResponseDto } from './dto/response/generate-chat-response.response.dto';
import { SubmitAnswerResponseDto } from './dto/response/submit-answer.response.dto';

@ApiTags('blocks')
@Controller('sessions/:sessionId/blocks')
export class BlocksController {
  constructor(
    private readonly generateBlockSequenceService: GenerateBlockSequenceService,
    private readonly generateSummaryBlockService: GenerateSummaryBlockService,
    private readonly getBlockByOrderIndexService: GetBlockByOrderIndexService,
    private readonly generateChatResponseService: GenerateChatResponseService,
    private readonly submitAnswerService: SubmitAnswerService,
  ) {}

  @Post('sequence')
  @ApiOperation({ summary: 'Generate block sequence', description: 'Generates next block sequence (1 inform + 3 practice blocks). Mode ("INITIAL" for first block sequence, "SUBSEQUENT" for subsequent block sequences) is automatically detected based on session state.' })
  @ApiParam({ name: 'sessionId', description: 'Unique session identifier' })
  @ApiBody({ type: GenerateBlockSequenceRequestDto })
  @ApiResponse({ status: 201, description: 'Block sequence generated successfully', type: GenerateBlockSequenceResponseDto })
  @ApiResponse({ status: 404, description: 'Session not found' })
  generateSequence(
    @Param('sessionId') sessionId: string,
    @Body() dto: GenerateBlockSequenceRequestDto,
  ): Promise<GenerateBlockSequenceResponseDto> {
    // Mode is automatically detected inside the service based on session state
    return this.generateBlockSequenceService.generate(sessionId);
  }

  @Post('summary')
  @ApiOperation({ summary: 'Generate summary block', description: 'Generates a summary block for the session with learning outcomes and performance summary' })
  @ApiParam({ name: 'sessionId', description: 'Unique session identifier' })
  @ApiBody({ type: GenerateSummaryBlockRequestDto })
  @ApiResponse({ status: 201, description: 'Summary block generated successfully', type: GenerateSummaryBlockResponseDto })
  @ApiResponse({ status: 404, description: 'Session not found' })
  generateSummary(
    @Param('sessionId') sessionId: string,
    @Body() dto: GenerateSummaryBlockRequestDto,
  ): Promise<GenerateSummaryBlockResponseDto> {
    return this.generateSummaryBlockService.generate(sessionId);
  }

  @Get(':orderIndex')
  @ApiOperation({ summary: 'Get block by order index', description: 'Retrieves a specific block by its order index within the session' })
  @ApiParam({ name: 'sessionId', description: 'Unique session identifier' })
  @ApiParam({ name: 'orderIndex', description: 'Block order index (0-based)' })
  @ApiBody({ type: GetBlockByOrderIndexRequestDto })
  @ApiResponse({ status: 200, description: 'Block found', type: GetBlockResponseDto })
  @ApiResponse({ status: 404, description: 'Block not found' })
  getBlock(
    @Param('sessionId') sessionId: string,
    @Param('orderIndex') orderIndex: string,
    @Body() dto: GetBlockByOrderIndexRequestDto,
  ) {
    return this.getBlockByOrderIndexService.getBlock(sessionId, parseInt(orderIndex));
  }

  @Post(':orderIndex/messages')
  @ApiOperation({ summary: 'Send message in inform block', description: 'Sends a chat message to an inform block and receives AI response from Owlbert' })
  @ApiParam({ name: 'sessionId', description: 'Unique session identifier' })
  @ApiParam({ name: 'orderIndex', description: 'Block order index (0-based)' })
  @ApiBody({ type: GenerateChatResponseRequestDto })
  @ApiResponse({ status: 201, description: 'Message sent and response received', type: GenerateChatResponseResponseDto })
  @ApiResponse({ status: 404, description: 'Block not found' })
  sendMessage(
    @Param('sessionId') sessionId: string,
    @Param('orderIndex') orderIndex: string,
    @Body() dto: GenerateChatResponseRequestDto,
  ) {
    return this.generateChatResponseService.send(sessionId, orderIndex, dto);
  }

  @Put(':orderIndex/student-answer')
  @ApiOperation({ summary: 'Submit answer for practice block', description: 'Persists student answer in database' })
  @ApiParam({ name: 'sessionId', description: 'Unique session identifier' })
  @ApiParam({ name: 'orderIndex', description: 'Block order index (0-based)' })
  @ApiBody({ type: SubmitAnswerRequestDto })
  @ApiResponse({ status: 200, description: 'Answer persisted successfully', type: SubmitAnswerResponseDto })
  @ApiResponse({ status: 404, description: 'Practice block not found' })
  submitAnswer(
    @Param('sessionId') sessionId: string,
    @Param('orderIndex') orderIndex: string,
    @Body() dto: SubmitAnswerRequestDto,
  ): Promise<SubmitAnswerResponseDto> {
    return this.submitAnswerService.submit(sessionId, orderIndex, dto);
  }
}
