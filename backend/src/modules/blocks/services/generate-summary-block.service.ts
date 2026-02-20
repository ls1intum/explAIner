import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { GenerateSessionSummaryChain } from '../../ai/llm/chains/generate-session-summary.chain';
import { BlockType } from '@prisma/client';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import { GenerateSummaryBlockResponseDto } from '../dto/response/generate-summary-block.response.dto';
import {
  mapSessionBlocksToSummaryContext,
  mapPrismaSummaryBlockToGenerateResponse,
} from '../block.utils';

@Injectable()
export class GenerateSummaryBlockService {
  constructor(
    private prisma: PrismaService,
    private generateSessionSummaryChain: GenerateSessionSummaryChain,
  ) {}

  @LogService()
  async generate(sessionId: string): Promise<GenerateSummaryBlockResponseDto> {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        blocks: {
          include: {
            informBlock: { include: { messages: true } },
            practiceBlock: true,
          },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });
    if (!session) throw new NotFoundException('Session not found');

    const { informContent, practiceResults } = mapSessionBlocksToSummaryContext(session.blocks);

    const sessionDuration = Math.floor(
      (Date.now() - new Date(session.startedAt).getTime()) / 1000 / 60,
    );

    const summaryBlock = await this.generateSessionSummaryChain.execute({
      topic: session.topic,
      learningGoal: session.learningGoal,
      bloomsLevel: session.learningGoalBloomsLevel,
      informContent,
      practiceResults,
    });

    // 6. Calculate next order index
    const nextOrderIndex = session.blocks.length;

    // 7. Create summary block
    const createdSummaryBlock = await this.prisma.block.create({
      data: {
        sessionId,
        orderIndex: nextOrderIndex,
        type: BlockType.Summary,
        summaryBlock: {
          create: {
            sessionSummary: summaryBlock.sessionSummary,
          },
        },
      },
      include: {
        summaryBlock: true,
      },
    });

    // 8. Update session completion status
    await this.prisma.session.update({
      where: { id: sessionId },
      data: {
        totalBlocks: session.totalBlocks + 1,
        completedAt: new Date(),
      },
    });

    return mapPrismaSummaryBlockToGenerateResponse(
      createdSummaryBlock as Parameters<typeof mapPrismaSummaryBlockToGenerateResponse>[0],
      sessionDuration,
      session.totalBlocks + 1,
    ) as GenerateSummaryBlockResponseDto;
  }
}
