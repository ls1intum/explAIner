import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from 'prisma/prisma.module';
import { AiModule } from './modules/ai/ai.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { LearningGoalsModule } from './modules/learning-goals/learning-goals.module';
import { BlocksModule } from './modules/blocks/blocks.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    AiModule,
    SessionsModule,
    LearningGoalsModule,
    BlocksModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
