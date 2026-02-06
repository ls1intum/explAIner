import { Controller, Get, Post, Patch, Body, Param, Delete } from '@nestjs/common';
import { CreateSessionService } from './services/create-session.service';
import { GetSessionService } from './services/get-session.service';
import { DeleteSessionService } from './services/delete-session.service';
import { ContinueSessionService } from './services/continue-session.service';
import { SubmitFeedbackService } from './services/submit-feedback.service';
import { UpdateCurrentBlockIndexService } from './services/update-current-block-index.service';
import { CreateSessionRequestDto } from './dto/create-session.request.dto';
import { GetSessionResponseDto } from './dto/get-session.response.dto';
import { ContinueSessionResponseDto } from './dto/continue-session.response.dto';
import { SubmitFeedbackRequestDto } from './dto/submit-feedback.request.dto';
import { SubmitFeedbackResponseDto } from './dto/submit-feedback.response.dto';
import { UpdateCurrentBlockIndexRequestDto } from './dto/update-current-block-index.request.dto';
import { UpdateCurrentBlockIndexResponseDto } from './dto/update-current-block-index.response.dto';
import { DeleteSessionResponseDto } from './dto/delete-session.response.dto';

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
  create(@Body() dto: CreateSessionRequestDto) {
    return this.createSessionService.create(dto);
  }

  @Get(':sessionId')
  findOne(@Param('sessionId') sessionId: string): Promise<GetSessionResponseDto> {
    return this.getSessionService.getById(sessionId);
  }

  @Delete(':sessionId')
  remove(@Param('sessionId') sessionId: string): Promise<DeleteSessionResponseDto> {
    return this.deleteSessionService.delete(sessionId);
  }

  @Patch(':sessionId/current-block-index')
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
  continue(
    @Param('sessionId') sessionId: string,
  ): Promise<ContinueSessionResponseDto> {
    return this.continueSessionService.continue(sessionId);
  }

  @Post(':sessionId/submit-feedback')
  submitFeedback(@Param('sessionId') sessionId: string, @Body() dto: SubmitFeedbackRequestDto): Promise<SubmitFeedbackResponseDto> {
    return this.submitFeedbackService.submit(sessionId, dto);
  }

}
