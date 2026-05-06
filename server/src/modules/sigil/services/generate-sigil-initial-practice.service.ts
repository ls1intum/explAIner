import { Injectable, Logger } from '@nestjs/common';
import { SessionsRepository } from '../../shared/database/repositories/sessions.repository';
import { BlocksRepository } from '../../shared/database/repositories/blocks.repository';
import { AtomicDatabaseTransactionRunner } from '../../shared/database/database.transaction-runner';
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

  async generateAsync(
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
