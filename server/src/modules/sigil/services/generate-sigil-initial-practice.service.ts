import { Injectable, Logger } from '@nestjs/common';
import { SessionsRepository } from '../../shared/database/repositories/sessions.repository';
import { BlocksRepository } from '../../shared/database/repositories/blocks.repository';
import { AtomicDatabaseTransactionRunner } from '../../shared/database/database.transaction-runner';
import { LlmUnavailableError } from '../../shared/llm/llm.service';
import { GenerateSigilPracticeChain } from '../llm/generate-sigil-practice.chain';
import { getSOLOLevelsForBlooms } from '../../../domain/didactical-frameworks/solo-taxonomy';
import type { BloomsLevel } from '../../../domain/schemas/enums.schema';

@Injectable()
export class GenerateSigilInitialPracticeService {
  private readonly logger = new Logger(GenerateSigilInitialPracticeService.name);

  constructor(
    private atomicDbTx: AtomicDatabaseTransactionRunner,
    private sessionsRepository: SessionsRepository,
    private blocksRepository: BlocksRepository,
    private generateSigilPracticeChain: GenerateSigilPracticeChain,
  ) {}

  /**
   * Fire-and-forget practice generation. On failure the reason is stored on the
   * session (practiceGenerationError) so the polling client can show an error
   * message instead of waiting forever.
   */
  start(
    sessionId: string,
    markdownContent: string,
    learningGoal: string,
    bloomsLevel: BloomsLevel,
    lang: string,
  ): void {
    this.generate(sessionId, markdownContent, learningGoal, bloomsLevel, lang).catch(async (err) => {
      this.logger.error(`Async practice generation failed for session ${sessionId}: ${err.message}`);
      const practiceGenerationError = err instanceof LlmUnavailableError ? 'llm_unavailable' : 'failed';
      await this.sessionsRepository
        .update(sessionId, { practiceGenerationError })
        .catch((e) => this.logger.error(`Could not store practice generation error for session ${sessionId}: ${e.message}`));
    });
  }

  private async generate(
    sessionId: string,
    markdownContent: string,
    learningGoal: string,
    bloomsLevel: BloomsLevel,
    lang: string,
  ): Promise<void> {
    const soloLevels = getSOLOLevelsForBlooms(bloomsLevel);

    const result = await this.generateSigilPracticeChain.execute({
      markdownContent,
      learningGoal,
      bloomsLevel,
      soloLevels: soloLevels.map((l) => l.toString()),
      lang,
    });

    await this.atomicDbTx.run(async (tx) => {
      await this.blocksRepository.createPracticeBlocks(
        sessionId,
        0, // orderIndex starts after inform block (index 0), so practice blocks get 1, 2, 3
        result.practiceBlocks,
        tx,
      );

      await this.sessionsRepository.update(sessionId, { totalBlocks: 4 }, tx);
    }, { timeout: 10_000 });

    this.logger.log(`Practice blocks generated for sigil session ${sessionId}`);
  }
}
