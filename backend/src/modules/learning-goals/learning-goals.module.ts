import { Module } from '@nestjs/common';
import { LearningGoalsController } from './learning-goals.controller';
import { GenerateLearningGoalsService } from './services/generate-learning-goals.service';
import { GenerateEasierLearningGoalsService } from './services/generate-easier-learning-goals.service';
import { LlmModule } from '../shared/llm/llm.module';
import { PrismaModule } from 'prisma/prisma.module';
import { DatabaseModule } from '../shared/database/database.module';

// Learning Goals Module: Handles learning goals generation for new session / easier session
@Module({
  imports: [PrismaModule, DatabaseModule, LlmModule],
  controllers: [LearningGoalsController],
  providers: [
    GenerateLearningGoalsService,
    GenerateEasierLearningGoalsService,
  ],
  exports: [
    GenerateLearningGoalsService,
    GenerateEasierLearningGoalsService,
  ],
})
export class LearningGoalsModule {}
