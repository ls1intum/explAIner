import { Injectable } from '@nestjs/common';
import { GenerateBlockSequenceChain } from '../../shared/llm/chains/generate-block-sequence.chain';
import {
  BlockSequenceMode,
} from '../../../domain/schemas/enums.schema';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import type { WrongAnswer } from '../../../domain/schemas/llm-parser/block-sequence.schema';
import { GenerateBlockSequenceResponseDto } from '../dto/response/generate-block-sequence.response.dto';
import { getSOLOLevelsForBlooms } from '../../../domain/didactical-frameworks/solo-taxonomy';
import { SessionsRepository } from '../../shared/database/sessions.repository';
import { BlocksRepository } from '../../shared/database/blocks.repository';
import { AtomicDatabaseTransactionRunner, type DatabaseTransactionClient } from '../../shared/database/database.transaction-runner';
import { mapToBlockResponseDto, extractWrongAnswersFromPracticeBlocks } from '../../shared/shared.utils';
import { formatInformBlockMessage } from '../block.utils';

/**
 * Service generating a block sequence = 1 x inform block + 3 x practice block
 */
@Injectable()
export class GenerateBlockSequenceService {
  constructor(
    private atomicDbTx: AtomicDatabaseTransactionRunner,
    private sessionsRepository: SessionsRepository,
    private blocksRepository: BlocksRepository,
    private generateBlockSequenceChain: GenerateBlockSequenceChain,
  ) {}

  @LogService()
  // Atomic: all DB ops commit together or roll back on any failure
  async generate(
    sessionId: string,
    tx?: DatabaseTransactionClient, // When provided, all DB ops run inside caller's atomic transaction
  ): Promise<GenerateBlockSequenceResponseDto> {
    // When called without tx (e.g. from controller), run in internal atomic transaction
    if (!tx) {
      return this.atomicDbTx.run(
        (t) => this.generate(sessionId, t),
        { timeout: 30_000 },
      );
    }
    const db = tx;

    // Fetch session data
    const session = await this.sessionsRepository.getSessionWithAllBlocks(sessionId, db);

    // Detect block-sequence mode
    // > INITIAL      = first block sequence of the session             -> provides information
    // > SUBSEQUENT   = any subsequent block sequences of the session   -> provide further information and clarify misconceptions of previous block sequence
    const mode =
      session.blocks.length === 0
        ? BlockSequenceMode.INITIAL
        : BlockSequenceMode.SUBSEQUENT;

    // Calculate starting order index for new block sequence blocks
    const nextOrderIndexStart =
      mode === BlockSequenceMode.INITIAL ? 0 : session.blocks.length;

    // Only if mode = SUBSEQUENT: extract wrong student answers from last block sequence practice questions
    const wrongAnswers: WrongAnswer[] =
      mode === BlockSequenceMode.SUBSEQUENT
        ? extractWrongAnswersFromPracticeBlocks(session.blocks, 'lastSequence')
        : [];

    // Call chain
    const blockSequence = await this.generateBlockSequenceChain.execute({
      mode,
      topic: session.topic,
      learningGoal: session.learningGoal,
      bloomsLevel: session.learningGoalBloomsLevel,
      priorKnowledge: session.priorKnowledge ?? '',
      wrongAnswers:
        mode === BlockSequenceMode.SUBSEQUENT ? wrongAnswers : undefined,
      soloLevels: getSOLOLevelsForBlooms(session.learningGoalBloomsLevel),
    });

    // Format inform block message depending on block-sequence mode
    // > INITIAL      inform block message = explanation + key facts + summary
    // > SUBSEQUENT   inform block message = explanation + key misconceptions + summary
    const formattedMessage = formatInformBlockMessage(mode, blockSequence.informBlock);

    // Create inform block and persist in database
    const informBlockCreated = await this.blocksRepository.createInformBlock(
      sessionId,
      nextOrderIndexStart,
      formattedMessage,
      mode === BlockSequenceMode.INITIAL,
      db,
    );

    // Persist 3 practice blocks in database
    const practiceBlocks = await this.blocksRepository.createPracticeBlocks(
      sessionId,
      nextOrderIndexStart,
      blockSequence.practiceBlocks,
      db,
    );

    // Update session total blocks count
    const newTotal =
      mode === BlockSequenceMode.INITIAL ? 4 : session.totalBlocks + 4;
    await this.sessionsRepository.update(sessionId, { totalBlocks: newTotal }, db);

    // Return response
    return {
      informBlock: mapToBlockResponseDto(informBlockCreated),
      practiceBlocks: [
        mapToBlockResponseDto(practiceBlocks[0]),
        mapToBlockResponseDto(practiceBlocks[1]),
        mapToBlockResponseDto(practiceBlocks[2]),
      ],
    } as GenerateBlockSequenceResponseDto;
  }
}
