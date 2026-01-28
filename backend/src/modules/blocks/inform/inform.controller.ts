import { Controller, Post, Body, Param } from '@nestjs/common';
import { InformService } from './inform.service';
import { FollowUpQuestionDto } from './dto/follow-up-question.dto';

@Controller('blocks/inform')
export class InformController {
  constructor(private readonly informService: InformService) {}

  @Post(':id/follow-up')
  followUp(@Param('id') id: string, @Body() dto: FollowUpQuestionDto) {
    return this.informService.handleFollowUpQuestion(id, dto.question);
  }
}
