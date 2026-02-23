import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from 'prisma/prisma.module';
import { LearningGoalsModule } from './modules/learning-goals/learning-goals.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { BlocksModule } from './modules/blocks/blocks.module';
import { LlmModule } from './modules/shared/llm/llm.module';
import { ZodSerializerInterceptor } from 'nestjs-zod';


@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    LearningGoalsModule,
    SessionsModule,
    BlocksModule,
    LlmModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
  ],
})
export class AppModule {}
