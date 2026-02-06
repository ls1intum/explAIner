import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from 'prisma/prisma.module';
import { LearningGoalsModule } from './modules/learning-goals/learning-goals.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { BlocksModule } from './modules/blocks/blocks.module';
import { AiModule } from './modules/ai/ai.module';


@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    LearningGoalsModule,
    SessionsModule,
    BlocksModule,
    AiModule,
  ],
})
export class AppModule {}
