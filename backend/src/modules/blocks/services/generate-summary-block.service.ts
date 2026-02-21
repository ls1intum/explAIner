import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { GenerateSessionSummaryChain } from '../../ai/llm/chains/generate-session-summary.chain';
import { BlockType } from '@prisma/client';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import { GenerateSummaryBlockResponseDto } from '../dto/response/generate-summary-block.response.dto';
import {
  mapSessionBlocksToSummaryContext,
  mapPrismaSummaryBlockToGenerateResponse,
} from '../block.utils';
import {
  getSessionDurationMinutes,
  getSessionWithInformContent,
} from '../../sessions/session.utils';

/** Creates the session summary block and marks the session as completed. */
@Injectable()
export class GenerateSummaryBlockService {
  constructor(
    private prisma: PrismaService,
    private generateSessionSummaryChain: GenerateSessionSummaryChain,
  ) {}

  @LogService()
  async generate(sessionId: string): Promise<GenerateSummaryBlockResponseDto> {
    const session = await getSessionWithInformContent(this.prisma, sessionId);
    const { informContent, practiceResults } =
      mapSessionBlocksToSummaryContext(session.blocks);
    const sessionDurationMinutes = getSessionDurationMinutes(session);

    const summaryBlock = await this.generateSessionSummaryChain.execute({
      topic: session.topic,
      learningGoal: session.learningGoal,
      bloomsLevel: session.learningGoalBloomsLevel,
      informContent,
      practiceResults,
    });

    const nextOrderIndex = session.blocks.length;
    const newTotalBlocks = session.totalBlocks + 1;

    // Atomic: summary block and session completion commit together or roll back.
    const [createdSummaryBlock] = await this.prisma.$transaction([
      this.prisma.block.create({
        data: {
          sessionId,
          orderIndex: nextOrderIndex,
          type: BlockType.Summary,
          summaryBlock: {
            create: { sessionSummary: summaryBlock.sessionSummary },
          },
        },
        include: { summaryBlock: true },
      }),
      this.prisma.session.update({
        where: { id: sessionId },
        data: { totalBlocks: newTotalBlocks, completedAt: new Date() },
      }),
    ]);

    return mapPrismaSummaryBlockToGenerateResponse(
      createdSummaryBlock as Parameters<
        typeof mapPrismaSummaryBlockToGenerateResponse
      >[0],
      sessionDurationMinutes,
      newTotalBlocks,
    ) as GenerateSummaryBlockResponseDto;
  }
}
