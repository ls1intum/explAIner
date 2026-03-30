import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

/** The DB client you get inside run(). Pass it to repositories so their reads/writes run in the same transaction - all commit or all roll back together. */
export type DatabaseTransactionClient = PrismaService;

/**
 * Runs a callback inside a single DB transaction. The callback receives a DatabaseTransactionClient (tx) to pass to repositories so their ops participate in that transaction.
 * Repositories can be called in two ways and both are atomic:
 * • Without tx (standalone): one DB op, use normal PrismaService - no transaction needed, atomic by itself.
 * • With tx (from run()): multiple ops in one transaction, all commit or all roll back, atomic as a group.
 */
@Injectable()
export class AtomicDatabaseTransactionRunner {
  constructor(private prisma: PrismaService) {}

  async run<T>(
    fn: (tx: DatabaseTransactionClient) => Promise<T>,
    options?: { timeout?: number },
  ): Promise<T> {
    return this.prisma.$transaction(fn, options);
  }
}


