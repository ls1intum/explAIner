import { Injectable } from '@nestjs/common';
import { GenerateSessionSummaryChain } from '../../shared/llm/chains/generate-session-summary.chain';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import { GenerateSummaryBlockResponseDto } from '../dto/response/generate-summary-block.response.dto';
import {
  buildContextForSessionSummary,
  mapToBlockResponseDto,
} from '../block.utils';
import { calculateSessionDurationMinutes } from '../../sessions/session.utils';
import { SessionsRepository } from '../../shared/database/sessions.repository';
import { BlocksRepository } from '../../shared/database/blocks.repository';
import { AtomicDatabaseTransactionRunner } from '../../shared/database/database.transaction-runner';

/** Service generating a session summary block and marking the session as completed */
@Injectable()
export class GenerateSummaryBlockService {
  constructor(
    private atomicDbTx: AtomicDatabaseTransactionRunner,
    private sessionsRepository: SessionsRepository,
    private blocksRepository: BlocksRepository,
    private generateSessionSummaryChain: GenerateSessionSummaryChain,
  ) {}

  @LogService()
  async generate(sessionId: string): Promise<GenerateSummaryBlockResponseDto> {

    // Fetch session data
    const session = await this.sessionsRepository.getSessionWithAllBlocks(sessionId);

    // Build context for session summary text
    const { informContent, practiceResults } = buildContextForSessionSummary(session.blocks);

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
    const createdSummaryBlock = await this.atomicDbTx.run(async (tx) => {
      const block = await this.blocksRepository.createSummaryBlock(
        sessionId,
        session.blocks.length,
        summaryBlock.sessionSummary,
        tx,
      );
      await this.sessionsRepository.update(sessionId, {
        totalBlocks: newTotalBlocks,
        completedAt: new Date(),
      }, tx);
      return block;
    });

    // Calculate session duration (startedAt comes from session above)
    const sessionDurationMinutes = calculateSessionDurationMinutes(session.startedAt);

    // Return response
    return {
      ...mapToBlockResponseDto(createdSummaryBlock),
      sessionDuration: sessionDurationMinutes,
      totalBlocks: newTotalBlocks,
    } as GenerateSummaryBlockResponseDto;
  }
}
