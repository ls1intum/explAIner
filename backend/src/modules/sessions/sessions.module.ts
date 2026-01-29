import { Module } from '@nestjs/common';
import { SessionsController } from './sessions.controller';
import { CreateSessionService } from './services/create-session.service';
import { GetSessionService } from './services/get-session.service';
import { DeleteSessionService } from './services/delete-session.service';
import { ContinueSessionService } from './services/continue-session.service';
import { SubmitFeedbackService } from './services/submit-feedback.service';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],
  controllers: [SessionsController],
  providers: [
    CreateSessionService,
    GetSessionService,
    DeleteSessionService,
    ContinueSessionService,
    SubmitFeedbackService,
  ],
  exports: [
    CreateSessionService,
    GetSessionService,
    DeleteSessionService,
    ContinueSessionService,
    SubmitFeedbackService,
  ],
})
export class SessionsModule {}
