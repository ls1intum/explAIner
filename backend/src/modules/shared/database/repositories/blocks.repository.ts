import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { BlockType, SoloLevel } from '../../../../domain/schemas/enums.schema';
import type { DatabaseTransactionClient } from '../database.transaction-runner';

/** Blocks Repository: Handles all block(sequence) related database operations */
@Injectable()
export class BlocksRepository {
  constructor(private prisma: PrismaService) {}

  async findBlockBySessionIdAndOrderIndex(sessionId: string, orderIndex: number) {
    return this.prisma.block.findUnique({
      where: { sessionId_orderIndex: { sessionId, orderIndex } },
      include: {
        informBlock: {
          include: { messages: { orderBy: { timestamp: 'asc' } } },
        },
        practiceBlock: true,
        summaryBlock: true,
      },
    });
  }

  async findInformBlockBySessionIdAndOrderIndexWithInformMessages(sessionId: string, orderIndex: number) {
    return this.prisma.block.findUnique({
      where: {
        sessionId_orderIndex: { sessionId, orderIndex },
      },
      include: {
        session: true,
        informBlock: {
          include: {
            messages: { orderBy: { timestamp: 'asc' } },
          },
        },
      },
    });
  }

  async findPracticeBlockBySessionIdAndOrderIndex(sessionId: string, orderIndex: number) {
    return this.prisma.block.findUnique({
      where: {
        sessionId_orderIndex: { sessionId, orderIndex },
      },
      include: { practiceBlock: true },
    });
  }

  async createInformBlock(
    sessionId: string,
    orderIndex: number,
    formattedMessage: string,
    alreadyViewed: boolean,
    tx?: DatabaseTransactionClient,
  ) {
    const db = tx ?? this.prisma;
    return db.block.create({
      data: {
        sessionId,
        orderIndex,
        type: BlockType.Inform,
        alreadyViewed,
        informBlock: {
          create: {
            messages: {
              create: [{ message: formattedMessage, sender: 'Owlbert' }],
            },
          },
        },
      },
      include: {
        informBlock: { include: { messages: true } },
      },
    });
  }

  async createInformBlockMessages(
    informBlockId: string,
    userMessage: string,
    owlbertMessage: string,
  ) {
    const [, owlbertMessageResult] = await this.prisma.$transaction([
      this.prisma.informBlockMessage.create({
        data: { informBlockId, message: userMessage, sender: 'User' },
      }),
      this.prisma.informBlockMessage.create({
        data: {
          informBlockId,
          message: owlbertMessage,
          sender: 'Owlbert',
        },
      }),
    ]);
    return owlbertMessageResult;
  }


  async createPracticeBlocks(
    sessionId: string,
    nextOrderIndexStart: number,
    practiceBlocks: Array<{
      soloLevel: string;
      question: string;
      answerOptions: string[];
      correctAnswerOptionIndices: number[];
    }>,
    tx?: DatabaseTransactionClient,
  ) {
    const db = tx ?? this.prisma;
    return Promise.all(
      practiceBlocks.map(async (practiceBlock, index) => {
        return db.block.create({
          data: {
            sessionId,
            orderIndex: nextOrderIndexStart + index + 1,
            type: BlockType.Practice,
            practiceBlock: {
              create: {
                soloLevel: practiceBlock.soloLevel as SoloLevel,
                question: practiceBlock.question,
                answerOptions: practiceBlock.answerOptions,
                correctAnswerOptionIndices: practiceBlock.correctAnswerOptionIndices,
              },
            },
          },
          include: {
            practiceBlock: true,
          },
        });
      }),
    );
  }

  async createSummaryBlock(
    sessionId: string,
    orderIndex: number,
    sessionSummary: string,
    tx?: DatabaseTransactionClient,
  ) {
    const db = tx ?? this.prisma;
    return db.block.create({
      data: {
        sessionId,
        orderIndex,
        type: BlockType.Summary,
        alreadyViewed: true,
        summaryBlock: {
          create: { sessionSummary },
        },
      },
      include: { summaryBlock: true },
    });
  }

  async updatePracticeBlockAnswer(
    blockId: string,
    data: { studentAnswerOptionIndices: number[]; studentAnswerIsCorrect: boolean },
  ) {
    return this.prisma.practiceBlock.update({
      where: { blockId },
      data,
    });
  }

  async updateBlockAsAlreadyViewed(sessionId: string, orderIndex: number, tx?: DatabaseTransactionClient) {
    const db = tx ?? this.prisma;
    return db.block.updateMany({
      where: { sessionId, orderIndex },
      data: { alreadyViewed: true },
    });
  }

}
