import { Module } from '@nestjs/common';
import { LearningGoalsController } from './learning-goals.controller';
import { GenerateLearningGoalsService } from './services/generate-learning-goals.service';
import { GenerateEasierLearningGoalsService } from './services/generate-easier-learning-goals.service';
import { LlmModule } from '../ai/llm/llm.module';

@Module({
  imports: [LlmModule],
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
