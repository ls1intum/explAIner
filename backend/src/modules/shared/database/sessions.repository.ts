import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import type { Prisma } from '@prisma/client';
import type { DatabaseTransactionClient } from './database.transaction-runner';

/** Sessions Repository: Handles all session related database operations */
@Injectable()
export class SessionsRepository {
  constructor(private prisma: PrismaService) {}

  async requireSessionExists(sessionId: string): Promise<{ id: string }> {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      select: { id: true },
    });
    if (!session) {
      throw new NotFoundException(`Session with ID ${sessionId} not found`);
    }
    return session;
  }

  async getSessionWithAllBlocks(sessionId: string, tx?: DatabaseTransactionClient) {
    const db = tx ?? this.prisma;
    const session = await db.session.findUnique({
      where: { id: sessionId },
      include: {
        blocks: {
          orderBy: { orderIndex: 'asc' },
          include: {
            informBlock: {
              include: { messages: { orderBy: { timestamp: 'asc' } } },
            },
            practiceBlock: true,
            summaryBlock: true,
          },
        },
      },
    });
    if (!session) throw new NotFoundException(`Session with ID ${sessionId} not found`);
    return session;
  }

  async create(data: Prisma.SessionCreateInput, tx?: DatabaseTransactionClient) {
    const db = tx ?? this.prisma;
    return db.session.create({
      data,
    });
  }

  async update(
    sessionId: string,
    data: Prisma.SessionUpdateInput,
    tx?: DatabaseTransactionClient,
  ) {
    const db = tx ?? this.prisma;
    return db.session.update({
      where: { id: sessionId },
      data,
    });
  }

  async delete(sessionId: string) {
    return this.prisma.session.delete({
      where: { id: sessionId },
    });
  }
}
