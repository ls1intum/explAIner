import { Module } from '@nestjs/common';
import { SessionsController } from './sessions.controller';
import { CreateSessionService } from './services/create-session.service';
import { GetSessionService } from './services/get-session.service';
import { DeleteSessionService } from './services/delete-session.service';
import { ContinueSessionService } from './services/continue-session.service';
import { SubmitFeedbackService } from './services/submit-feedback.service';
import { UpdateCurrentBlockIndexService } from './services/update-current-block-index.service';
import { BlocksModule } from '../blocks/blocks.module';

// Sessions Module: Handles session lifecycle (create, continue, get, delete, feedback)
@Module({
  imports: [BlocksModule],
  controllers: [SessionsController],
  providers: [
    CreateSessionService,
    GetSessionService,
    DeleteSessionService,
    ContinueSessionService,
    SubmitFeedbackService,
    UpdateCurrentBlockIndexService,
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
