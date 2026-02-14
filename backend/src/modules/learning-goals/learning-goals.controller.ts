import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';
import { GenerateLearningGoalsService } from './services/generate-learning-goals.service';
import { GenerateEasierLearningGoalsService } from './services/generate-easier-learning-goals.service';
import { GenerateLearningGoalsRequestDto } from './dto/request/generate-learning-goals.request.dto';
import { GenerateEasierLearningGoalsRequestDto } from './dto/request/generate-easier-learning-goals.request.dto';
import { GenerateLearningGoalsResponseDto } from './dto/response/generate-learning-goals.response.dto';
import { GenerateEasierLearningGoalsResponseDto } from './dto/response/generate-easier-learning-goals.response.dto';

@ApiTags('learning-goals')
@Controller('learning-goals')
export class LearningGoalsController {
  constructor(
    private readonly generateLearningGoalsService: GenerateLearningGoalsService,
    private readonly generateEasierLearningGoalsService: GenerateEasierLearningGoalsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Generate learning goals', description: 'Generates learning goals based on topic and optional prior knowledge keywordsusing AI' })
  @ApiBody({ type: GenerateLearningGoalsRequestDto })
  @ZodResponse({ status: 201, description: 'Learning goals generated successfully', type: GenerateLearningGoalsResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  generate(@Body() dto: GenerateLearningGoalsRequestDto) {
    return this.generateLearningGoalsService.generate(dto);
  }

  @Post('easier')
  @ApiOperation({ summary: 'Generate easier learning goals', description: 'Generates easier learning goals for a new session based on context of existing previous session' })
  @ApiBody({ type: GenerateEasierLearningGoalsRequestDto })
  @ZodResponse({ status: 201, description: 'Easier learning goals generated successfully', type: GenerateEasierLearningGoalsResponseDto })
  @ApiResponse({ status: 404, description: 'Previous session not found' })
  generateEasier(@Body() dto: GenerateEasierLearningGoalsRequestDto) {
    return this.generateEasierLearningGoalsService.generate(dto);
  }
}
