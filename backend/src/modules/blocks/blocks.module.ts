import { Module } from '@nestjs/common';
import { BlocksService } from './blocks.service';
import { BlocksController } from './blocks.controller';
import { InformService } from './inform/inform.service';
import { InformController } from './inform/inform.controller';
import { PracticeService } from './practice/practice.service';
import { PracticeController } from './practice/practice.controller';
import { SummaryService } from './summary/summary.service';

@Module({
  controllers: [BlocksController, InformController, PracticeController],
  providers: [BlocksService, InformService, PracticeService, SummaryService],
  exports: [BlocksService, InformService, PracticeService, SummaryService],
})
export class BlocksModule {}
