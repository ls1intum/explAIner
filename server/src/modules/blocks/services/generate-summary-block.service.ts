import { Injectable, Logger } from '@nestjs/common';
import { GenerateSessionSummaryChain } from '../../shared/llm/chains/generate-session-summary.chain';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import { GenerateSummaryBlockResponseDto } from '../dto/response/generate-summary-block.response.dto';
import { buildContextForSessionSummary, buildFallbackSessionSummary } from '../blocks.utils';
import { mapToBlockResponseDto, calculateSessionDurationMinutes } from '../../shared/shared.utils';
import { SessionsRepository } from '../../shared/database/repositories/sessions.repository';
import { BlocksRepository } from '../../shared/database/repositories/blocks.repository';
import { AtomicDatabaseTransactionRunner } from '../../shared/database/database.transaction-runner';

/** Service generating a session summary block and marking the session as completed */
@Injectable()
export class GenerateSummaryBlockService {
  private readonly logger = new Logger(GenerateSummaryBlockService.name);

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

    // Call chain; if the LLM fails, use a fixed summary so the learner is never stuck at the end
    let sessionSummary: string;
    try {
      const summaryBlock = await this.generateSessionSummaryChain.execute({
        topic: session.topic,
        learningGoal: session.learningGoal,
        bloomsLevel: session.learningGoalBloomsLevel,
        informContent,
        practiceResults,
        lang: session.lang,
      });
      sessionSummary = summaryBlock.sessionSummary;
    } catch (error) {
      this.logger.warn(`Summary generation failed for session ${sessionId}, using fallback: ${error.message}`);
      sessionSummary = buildFallbackSessionSummary(session.learningGoal, practiceResults, session.lang);
    }

    // Increment total blocks counter
    const newTotalBlocks = session.totalBlocks + 1;

    // Atomic: summary block and session completion commit together or roll back
    const createdSummaryBlock = await this.atomicDbTx.run(async (tx) => {
      const block = await this.blocksRepository.createSummaryBlock(
        sessionId,
        session.blocks.length,
        sessionSummary,
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
