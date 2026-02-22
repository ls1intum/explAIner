import { Controller, Get, Post, Patch, Put, Body, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';
import { CreateSessionService } from './services/create-session.service';
import { GetSessionService } from './services/get-session.service';
import { DeleteSessionService } from './services/delete-session.service';
import { ContinueSessionService } from './services/continue-session.service';
import { SubmitFeedbackService } from './services/submit-feedback.service';
import { UpdateCurrentBlockIndexService } from './services/update-current-block-index.service';
import { CreateSessionRequestDto } from './dto/request/create-session.request.dto';
import { ContinueSessionRequestDto } from './dto/request/continue-session.request.dto';
import { GetSessionRequestDto } from './dto/request/get-session.request.dto';
import { DeleteSessionRequestDto } from './dto/request/delete-session.request.dto';
import { GetSessionResponseDto } from './dto/response/get-session.response.dto';
import { ContinueSessionResponseDto } from './dto/response/continue-session.response.dto';
import { SubmitFeedbackRequestDto } from './dto/request/submit-feedback.request.dto';
import { SubmitFeedbackResponseDto } from './dto/response/submit-feedback.response.dto';
import { UpdateCurrentBlockIndexRequestDto } from './dto/request/update-current-block-index.request.dto';
import { UpdateCurrentBlockIndexResponseDto } from './dto/response/update-current-block-index.response.dto';
import { DeleteSessionResponseDto } from './dto/response/delete-session.response.dto';
import { CreateSessionResponseDto } from './dto/response/create-session.response.dto';

@ApiTags('sessions')
@Controller('sessions')
export class SessionsController {
  constructor(
    private readonly createSessionService: CreateSessionService,
    private readonly getSessionService: GetSessionService,
    private readonly deleteSessionService: DeleteSessionService,
    private readonly continueSessionService: ContinueSessionService,
    private readonly submitFeedbackService: SubmitFeedbackService,
    private readonly updateCurrentBlockIndexService: UpdateCurrentBlockIndexService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new learning session', description: 'Creates a new session with learning goals and initial block sequence (1 inform + 3 practice blocks)' })
  @ApiBody({ type: CreateSessionRequestDto })
  @ZodResponse({ status: 201, description: 'Session created successfully', type: CreateSessionResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  create(@Body() dto: CreateSessionRequestDto): Promise<CreateSessionResponseDto> {
    return this.createSessionService.create(dto);
  }

  @Get(':sessionId')
  @ApiOperation({ summary: 'Get session by ID', description: 'Retrieves session details with all blocks for rehydrating frontend state' })
  @ApiParam({ name: 'sessionId', description: 'Unique session identifier' })
  @ApiBody({ type: GetSessionRequestDto })
  @ZodResponse({ status: 200, description: 'Session found', type: GetSessionResponseDto })
  @ApiResponse({ status: 404, description: 'Session not found' })
  findOne(@Param('sessionId') sessionId: string, @Body() dto: GetSessionRequestDto): Promise<GetSessionResponseDto> {
    return this.getSessionService.getById(sessionId);
  }

  @Delete(':sessionId')
  @ApiOperation({ summary: 'Delete session', description: 'Deletes a session and all related data if user ends the session before completing it' })
  @ApiParam({ name: 'sessionId', description: 'Unique session identifier' })
  @ApiBody({ type: DeleteSessionRequestDto })
  @ZodResponse({ status: 200, description: 'Session deleted successfully', type: DeleteSessionResponseDto })
  @ApiResponse({ status: 404, description: 'Session not found' })
  remove(@Param('sessionId') sessionId: string, @Body() dto: DeleteSessionRequestDto): Promise<DeleteSessionResponseDto> {
    return this.deleteSessionService.delete(sessionId);
  }

  @Patch(':sessionId/current-block-index')
  @ApiOperation({ summary: 'Update current block index', description: 'Updates the current block index (0-based index of the currently / last viewed block by the user) and marks the block as already viewed' })
  @ApiParam({ name: 'sessionId', description: 'Unique session identifier' })
  @ApiBody({ type: UpdateCurrentBlockIndexRequestDto })
  @ZodResponse({ status: 200, description: 'Current block index updated successfully', type: UpdateCurrentBlockIndexResponseDto })
  @ApiResponse({ status: 404, description: 'Session not found' })
  updateCurrentBlockIndex(
    @Param('sessionId') sessionId: string,
    @Body() dto: UpdateCurrentBlockIndexRequestDto,
  ): Promise<UpdateCurrentBlockIndexResponseDto> {
    return this.updateCurrentBlockIndexService.updateCurrentBlockIndex(
      sessionId,
      dto.currentBlockIndex,
    );
  }

  @Post(':sessionId/continue')
  @ApiOperation({ summary: 'Continue session', description: 'Determines next action based on session context (navigate, summary, next-sequence, or prompt-user)' })
  @ApiParam({ name: 'sessionId', description: 'Unique session identifier' })
  @ApiBody({ type: ContinueSessionRequestDto })
  @ZodResponse({ status: 201, description: 'Next action determined', type: ContinueSessionResponseDto })
  @ApiResponse({ status: 404, description: 'Session not found' })
  continue(
    @Param('sessionId') sessionId: string,
    @Body() dto: ContinueSessionRequestDto,
  ): Promise<ContinueSessionResponseDto> {
    return this.continueSessionService.continue(sessionId);
  }

  @Put(':sessionId/feedback')
  @ApiOperation({ summary: 'Submit user feedback', description: 'Submits user rating/feedback for the session (1-5 stars) - 1: "very unhelpful", 5: "very helpful"' })
  @ApiParam({ name: 'sessionId', description: 'Unique session identifier' })
  @ApiBody({ type: SubmitFeedbackRequestDto })
  @ZodResponse({ status: 200, description: 'Feedback submitted successfully', type: SubmitFeedbackResponseDto })
  @ApiResponse({ status: 404, description: 'Session not found' })
  submitFeedback(@Param('sessionId') sessionId: string, @Body() dto: SubmitFeedbackRequestDto): Promise<SubmitFeedbackResponseDto> {
    return this.submitFeedbackService.submit(sessionId, dto);
  }

}
