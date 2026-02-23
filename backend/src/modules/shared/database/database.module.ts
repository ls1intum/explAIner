import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { SessionsRepository } from './sessions.repository';
import { BlocksRepository } from './blocks.repository';

// Database Module: Provides shared database repositories for other modules
@Module({
  imports: [PrismaModule],
  providers: [SessionsRepository, BlocksRepository],
  exports: [SessionsRepository, BlocksRepository],
})
export class DatabaseModule {}
