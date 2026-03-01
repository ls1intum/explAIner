import { Injectable } from '@nestjs/common';
import { CreateSessionRequestDto } from '../dto/request/create-session.request.dto';
import { GenerateBlockSequenceService } from '../../blocks/services/generate-block-sequence.service';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import { mapToCreateSessionResponseDto } from '../sessions.utils';
import { SessionsRepository } from '../../shared/database/repositories/sessions.repository';
import { AtomicDatabaseTransactionRunner } from '../../shared/database/database.transaction-runner';

/** Service creating a new session including the initial block sequence */
@Injectable()
export class CreateSessionService {
  constructor(
    private atomicDbTx: AtomicDatabaseTransactionRunner,
    private sessionsRepository: SessionsRepository,
    private generateBlockSequenceService: GenerateBlockSequenceService,
  ) {}

  @LogService()
  async create(dto: CreateSessionRequestDto) {

    // Atomic: session + block sequence commit together or roll back on any failure
    return this.atomicDbTx.run(async (tx) => {

      // Create session
      const session = await this.sessionsRepository.create({
        topic: dto.topic,
        learningGoal: dto.learningGoal.learningGoal,
        learningGoalBloomsLevel: dto.learningGoal.bloomsLevel,
        priorKnowledge: dto.priorKnowledge ?? undefined,
      }, tx);

      // Generate block sequence
      const { informBlock, practiceBlocks } =
        await this.generateBlockSequenceService.generate(session.id, tx);

      // Return response
      return mapToCreateSessionResponseDto(session, dto, [
        informBlock,
        ...practiceBlocks,
      ]);
    }, { timeout: 30_000 });
  }
}
