import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { SessionMemoryService } from './memory/session-memory.service';

@Module({
  controllers: [AiController],
  providers: [AiService, SessionMemoryService],
  exports: [AiService, SessionMemoryService],
})
export class AiModule {}
