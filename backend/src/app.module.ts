import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from 'prisma/prisma.module';
import { LearningGoalsModule } from './modules/learning-goals/learning-goals.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { BlocksModule } from './modules/blocks/blocks.module';
import { AiModule } from './modules/ai/ai.module';
import { ZodSerializerInterceptor } from 'nestjs-zod';


@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    LearningGoalsModule,
    SessionsModule,
    BlocksModule,
    AiModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
  ],
})
export class AppModule {}
