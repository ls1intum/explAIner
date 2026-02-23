import { Injectable } from '@nestjs/common';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import { UpdateCurrentBlockIndexResponseDto } from '../dto/response/update-current-block-index.response.dto';
import { SessionsRepository } from '../../shared/database/sessions.repository';
import { BlocksRepository } from '../../shared/database/blocks.repository';
import { AtomicDatabaseTransactionRunner } from '../../shared/database/database.transaction-runner';

/** Service updating the session's current block index and marking that block as viewed */
@Injectable()
export class UpdateCurrentBlockIndexService {
  constructor(
    private atomicDbTx: AtomicDatabaseTransactionRunner,
    private sessionsRepository: SessionsRepository,
    private blocksRepository: BlocksRepository,
  ) {}

  @LogService()
  async updateCurrentBlockIndex(
    sessionId: string,
    currentBlockIndex: number,
  ): Promise<UpdateCurrentBlockIndexResponseDto> {

    // Ensure session exists
    await this.sessionsRepository.requireSessionExists(sessionId);

    // Atomic: both updates commit together or roll back
    await this.atomicDbTx.run(async (tx) => {
      await this.sessionsRepository.update(sessionId, { currentBlockIndex }, tx);
      await this.blocksRepository.updateBlockAsAlreadyViewed(sessionId, currentBlockIndex, tx);
    });

    // Return response
    return { success: true as const, currentBlockIndex };
  }
}
