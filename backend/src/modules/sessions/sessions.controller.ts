import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CreateSessionService } from './services/create-session.service';
import { GetSessionService } from './services/get-session.service';
import { DeleteSessionService } from './services/delete-session.service';
import { ContinueSessionService } from './services/continue-session.service';
import { SubmitFeedbackService } from './services/submit-feedback.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { ContinueSessionDto } from './dto/continue-session.dto';
import { SubmitFeedbackDto } from './dto/submit-feedback.dto';

@Controller('sessions')
export class SessionsController {
  constructor(
    private readonly createSessionService: CreateSessionService,
    private readonly getSessionService: GetSessionService,
    private readonly deleteSessionService: DeleteSessionService,
    private readonly continueSessionService: ContinueSessionService,
    private readonly submitFeedbackService: SubmitFeedbackService,
  ) {}

  @Post()
  create(@Body() dto: CreateSessionDto) {
    return this.createSessionService.create(dto);
  }

  @Get(':sessionId')
  findOne(@Param('sessionId') sessionId: string) {
    return this.getSessionService.getById(sessionId);
  }

  @Delete(':sessionId')
  remove(@Param('sessionId') sessionId: string) {
    return this.deleteSessionService.delete(sessionId);
  }

  @Post(':sessionId/continue')
  continue(@Param('sessionId') sessionId: string, @Body() dto: ContinueSessionDto) {
    return this.continueSessionService.continue(sessionId, dto);
  }

  @Post(':sessionId/submit-feedback')
  submitFeedback(@Param('sessionId') sessionId: string, @Body() dto: SubmitFeedbackDto) {
    return this.submitFeedbackService.submit(sessionId, dto);
  }
}
