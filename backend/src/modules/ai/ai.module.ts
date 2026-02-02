import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { SessionMemoryService } from './memory/session-memory.service';
import { GenerateLearningGoalsService as AiGenerateLearningGoalsService } from './services/generate-learning-goals.service';
import { GenerateLearningGoalsChain } from './chains/generate-learning-goals.chain';

@Module({
  controllers: [AiController],
  providers: [
    AiService,
    SessionMemoryService,
    GenerateLearningGoalsChain,
    AiGenerateLearningGoalsService,
  ],
  exports: [AiService, SessionMemoryService, AiGenerateLearningGoalsService],
})
export class AiModule {}
