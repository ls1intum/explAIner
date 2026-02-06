import { Controller, Post, Body } from '@nestjs/common';
import { GenerateLearningGoalsService } from './services/generate-learning-goals.service';
import { GenerateEasierLearningGoalsService } from './services/generate-easier-learning-goals.service';
import { GenerateLearningGoalsRequestDto } from './dto/generate-learning-goals.request.dto';
import { GenerateEasierLearningGoalsRequestDto } from './dto/generate-easier-learning-goals.request.dto';

@Controller('learning-goals')
export class LearningGoalsController {
  constructor(
    private readonly generateLearningGoalsService: GenerateLearningGoalsService,
    private readonly generateEasierLearningGoalsService: GenerateEasierLearningGoalsService,
  ) {}

  @Post()
  generate(@Body() dto: GenerateLearningGoalsRequestDto) {
    return this.generateLearningGoalsService.generate(dto);
  }

  @Post('easier')
  generateEasier(@Body() dto: GenerateEasierLearningGoalsRequestDto) {
    return this.generateEasierLearningGoalsService.generate(dto);
  }
}
