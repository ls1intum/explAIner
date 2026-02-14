import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { GenerateSummaryBlockChain } from '../../ai/chains/generate-summary-block.chain';
import { BlockType } from '@prisma/client';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import { GenerateSummaryBlockResponseDto } from '../dto/response/generate-summary-block.response.dto';

@Injectable()
export class GenerateSummaryBlockService {
  constructor(
    private prisma: PrismaService,
    private generateSummaryBlockChain: GenerateSummaryBlockChain,
  ) {}

  @LogService()
  async generate(sessionId: string): Promise<GenerateSummaryBlockResponseDto> {
    // 1. Fetch session data with all blocks
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        blocks: {
          include: {
            informBlockMessages: true,
            practiceBlock: true,
          },
          orderBy: {
            orderIndex: 'asc',
          },
        },
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    // 2. Extract inform content (first message from each inform block)
    const informBlocks = session.blocks.filter(
      (block) => block.type === BlockType.Inform,
    );
    const informContent = informBlocks.map((block) => {
      const firstMessage = block.informBlockMessages?.[0]?.message || '';
      return firstMessage;
    });

    // 3. Extract practice results for AI summary generation
    const practiceBlocks = session.blocks.filter(
      (block) => block.type === BlockType.Practice && block.practiceBlock,
    );
    const practiceResults = practiceBlocks.map((block) => ({
      question: block.practiceBlock!.question,
      isCorrect: block.practiceBlock!.studentAnswerIsCorrect || false,
    }));

    // 4. Calculate session duration (difference between now and startedAt)
    const sessionDuration = Math.floor(
      (Date.now() - new Date(session.startedAt).getTime()) / 1000 / 60,
    ); // in minutes

    // 5. Call chain to generate summary
    const summaryBlock = await this.generateSummaryBlockChain.execute({
      topic: session.learningTopicOrQuestion,
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

    // 9. Return summary block with additional session stats mapped to DTO
    return {
      block: createdSummaryBlock as any,
      sessionStats: {
        learningGoal: session.learningGoal,
        bloomsLevel: session.learningGoalBloomsLevel,
        totalBlocks: session.totalBlocks + 1,
        sessionDuration,
      },
    };
  }
}
