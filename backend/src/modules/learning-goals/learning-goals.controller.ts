import { Controller, Post, Body } from '@nestjs/common';
import { GenerateLearningGoalsService } from './services/generate-learning-goals.service';
import { GenerateEasierLearningGoalsService } from './services/generate-easier-learning-goals.service';
import { GenerateLearningGoalsDto } from './dto/generate-learning-goals.dto';
import { GenerateEasierLearningGoalsDto } from './dto/generate-easier-learning-goals.dto';

@Controller('learning-goals')
export class LearningGoalsController {
  constructor(
    private readonly generateLearningGoalsService: GenerateLearningGoalsService,
    private readonly generateEasierLearningGoalsService: GenerateEasierLearningGoalsService,
  ) {}

  @Post()
  generate(@Body() dto: GenerateLearningGoalsDto) {
    return this.generateLearningGoalsService.generate(dto);
  }

  @Post('easier')
  generateEasier(@Body() dto: GenerateEasierLearningGoalsDto) {
    return this.generateEasierLearningGoalsService.generate(dto);
  }
}
