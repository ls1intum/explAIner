import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { GenerateSessionSummaryChain } from '../../ai/llm/chains/generate-session-summary.chain';
import { BlockType } from '../../../domain/schemas/enums.schema';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import { GenerateSummaryBlockResponseDto } from '../dto/response/generate-summary-block.response.dto';
import {
  mapSessionBlocksToSummaryContext,
  mapToBlockResponseDto,
  type BlockWithIncludes,
} from '../block.utils';
import {
  calculateSessionDurationMinutes,
  getSessionWithAllBlocks,
} from '../../sessions/session.utils';

/** Service generating a session summary block and marking the session as completed */
@Injectable()
export class GenerateSummaryBlockService {
  constructor(
    private prisma: PrismaService,
    private generateSessionSummaryChain: GenerateSessionSummaryChain,
  ) {}

  @LogService()
  async generate(sessionId: string): Promise<GenerateSummaryBlockResponseDto> {

    // Fetch session data
    const session = await getSessionWithAllBlocks(this.prisma, sessionId);

    // Build context for session summary text
    const { informContent, practiceResults } =
      mapSessionBlocksToSummaryContext(session.blocks);

    // Call chain
    const summaryBlock = await this.generateSessionSummaryChain.execute({
      topic: session.topic,
      learningGoal: session.learningGoal,
      bloomsLevel: session.learningGoalBloomsLevel,
      informContent,
      practiceResults,
    });

    // Increment total blocks counter
    const newTotalBlocks = session.totalBlocks + 1;

    // Atomic: summary block and session completion commit together or roll back
    const [createdSummaryBlock] = await this.prisma.$transaction([

      // Create summary block and persist in database
      this.prisma.block.create({
        data: {
          sessionId,
          orderIndex: session.blocks.length,
          type: BlockType.Summary,
          summaryBlock: {
            create: { sessionSummary: summaryBlock.sessionSummary },
          },
        },
        include: { summaryBlock: true },
      }),

      // Update session metadata (total blocks & completedAt)
      this.prisma.session.update({
        where: { id: sessionId },
        data: { totalBlocks: newTotalBlocks, completedAt: new Date() },
      }),
    ]);

    // Calculate session duration
    const sessionDurationMinutes = calculateSessionDurationMinutes(session);

    // Return response
    return {
      ...mapToBlockResponseDto(
        createdSummaryBlock as BlockWithIncludes,
      ),
      sessionDuration: sessionDurationMinutes,
      totalBlocks: newTotalBlocks,
    } as GenerateSummaryBlockResponseDto;
  }
}
