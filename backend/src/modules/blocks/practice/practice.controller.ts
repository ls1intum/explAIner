import { Controller, Post, Body, Param } from '@nestjs/common';
import { PracticeService } from './practice.service';
import { SubmitAnswerDto } from './dto/submit-answer.dto';

@Controller('blocks/practice')
export class PracticeController {
  constructor(private readonly practiceService: PracticeService) {}

  @Post(':id/submit')
  submit(@Param('id') id: string, @Body() dto: SubmitAnswerDto) {
    return this.practiceService.submitAnswer(id, dto.answerId, dto.timeSpent);
  }
}
