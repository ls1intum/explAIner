import { Injectable } from '@nestjs/common';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import { SessionsRepository } from '../../shared/database/repositories/sessions.repository';
import { BlocksRepository } from '../../shared/database/repositories/blocks.repository';
import { AtomicDatabaseTransactionRunner } from '../../shared/database/database.transaction-runner';
import { SigilContentLoader } from '../content/sigil-content.loader';
import { GenerateSigilSubsequentChain } from '../llm/generate-sigil-subsequent.chain';
import { SIGIL_SECTION_CONFIG, type SigilLang } from '../sigil.config';
import { getSOLOLevelsForBlooms } from '../../../domain/didactical-frameworks/solo-taxonomy';
import { extractWrongAnswersFromPracticeBlocks, mapToBlockResponseDto } from '../../shared/shared.utils';
import { formatInformBlockMessage } from '../../blocks/blocks.utils';
import { BlockSequenceMode } from '../../../domain/schemas/enums.schema';

@Injectable()
export class GenerateSigilBlockSequenceService {
  constructor(
    private atomicDbTx: AtomicDatabaseTransactionRunner,
    private sessionsRepository: SessionsRepository,
    private blocksRepository: BlocksRepository,
    private contentLoader: SigilContentLoader,
    private generateSubsequentChain: GenerateSigilSubsequentChain,
  ) {}

  @LogService()
  async generate(sessionId: string, lang: SigilLang) {
    const session = await this.sessionsRepository.getSessionWithAllBlocks(sessionId);

    // Only explainer sessions have practice, and they all use the single section.
    const config = SIGIL_SECTION_CONFIG.elements;
    const markdownContent = this.contentLoader.getSections(lang, ...config.sections);
    const soloLevels = getSOLOLevelsForBlooms(config.bloomsLevel);

    const wrongAnswers = extractWrongAnswersFromPracticeBlocks(session.blocks, 'lastSequence');

    // The LLM call runs outside the transaction: under load logos can take
    // longer than any sensible transaction timeout, which used to expire the
    // transaction and answer with a 500 after the LLM had already responded.
    const blockSequence = await this.generateSubsequentChain.execute({
      markdownContent,
      learningGoal: session.learningGoal,
      bloomsLevel: config.bloomsLevel,
      soloLevels: soloLevels.map((l) => l.toString()),
      wrongAnswers,
      lang,
    });
    const formattedMessage = formatInformBlockMessage(BlockSequenceMode.SUBSEQUENT, blockSequence.informBlock);

    return this.atomicDbTx.run(async (tx) => {
      // Re-read inside the transaction so the order indices and block count are current.
      const current = await this.sessionsRepository.getSessionWithAllBlocks(sessionId, tx);
      const nextOrderIndexStart = current.blocks.length;

      const informBlock = await this.blocksRepository.createInformBlock(
        sessionId,
        nextOrderIndexStart,
        formattedMessage,
        true,
        tx,
      );

      const practiceBlocks = await this.blocksRepository.createPracticeBlocks(
        sessionId,
        nextOrderIndexStart,
        blockSequence.practiceBlocks,
        tx,
      );

      const newTotal = current.totalBlocks + 4;
      await this.sessionsRepository.update(sessionId, { totalBlocks: newTotal }, tx);

      return {
        informBlock: mapToBlockResponseDto(informBlock),
        practiceBlocks: practiceBlocks.map(mapToBlockResponseDto),
      };
    }, { timeout: 10_000 });
  }
}
