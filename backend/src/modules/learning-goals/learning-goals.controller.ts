import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { LearningGoalsService } from './learning-goals.service';
import { GenerateGoalsDto } from './dto/generate-goals.dto';

@Controller('learning-goals')
export class LearningGoalsController {
  constructor(private readonly learningGoalsService: LearningGoalsService) {}

  @Post('generate')
  generate(@Body() generateGoalsDto: GenerateGoalsDto) {
    return this.learningGoalsService.generate(generateGoalsDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.learningGoalsService.findOne(id);
  }
}
