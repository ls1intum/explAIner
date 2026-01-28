import { Module } from '@nestjs/common';
import { LearningGoalsService } from './learning-goals.service';
import { LearningGoalsController } from './learning-goals.controller';

@Module({
  controllers: [LearningGoalsController],
  providers: [LearningGoalsService],
  exports: [LearningGoalsService],
})
export class LearningGoalsModule {}
