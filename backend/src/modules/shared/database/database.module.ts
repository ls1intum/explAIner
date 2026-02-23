import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { SessionsRepository } from './sessions.repository';
import { BlocksRepository } from './blocks.repository';
import { AtomicDatabaseTransactionRunner } from './database.transaction-runner';

// Database Module: Provides shared database repositories and transaction boundary for other modules
@Module({
  imports: [PrismaModule],
  providers: [SessionsRepository, BlocksRepository, AtomicDatabaseTransactionRunner],
  exports: [SessionsRepository, BlocksRepository, AtomicDatabaseTransactionRunner],
})
export class DatabaseModule {}
