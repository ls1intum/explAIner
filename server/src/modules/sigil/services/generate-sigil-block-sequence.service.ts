import { Injectable } from '@nestjs/common';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import { SessionsRepository } from '../../shared/database/repositories/sessions.repository';
import { BlocksRepository } from '../../shared/database/repositories/blocks.repository';
import { AtomicDatabaseTransactionRunner } from '../../shared/database/database.transaction-runner';
import { SigilContentLoader } from '../content/sigil-content.loader';
import { GenerateSigilSubsequentChain } from '../llm/generate-sigil-subsequent.chain';
import { SIGIL_MODE_CONFIG, type SigilLang, type SigilModeKey } from '../sigil.config';
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
    return this.atomicDbTx.run(async (tx) => {
      const session = await this.sessionsRepository.getSessionWithAllBlocks(sessionId, tx);

      const modeKey = (session.sigilMode?.toLowerCase() ?? 'elements') as SigilModeKey;
      const config = SIGIL_MODE_CONFIG[modeKey];
      const [from, to] = config.sections;
      const markdownContent = this.contentLoader.getSections(lang, from, to);
      const soloLevels = getSOLOLevelsForBlooms(config.bloomsLevel!);

      const wrongAnswers = extractWrongAnswersFromPracticeBlocks(session.blocks, 'lastSequence');

      const blockSequence = await this.generateSubsequentChain.execute({
        markdownContent,
        learningGoal: session.learningGoal,
        bloomsLevel: config.bloomsLevel!,
        soloLevels: soloLevels.map((l) => l.toString()),
        wrongAnswers,
        lang,
      });

      const nextOrderIndexStart = session.blocks.length;
      const formattedMessage = formatInformBlockMessage(BlockSequenceMode.SUBSEQUENT, blockSequence.informBlock);

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

      const newTotal = session.totalBlocks + 4;
      await this.sessionsRepository.update(sessionId, { totalBlocks: newTotal }, tx);

      return {
        informBlock: mapToBlockResponseDto(informBlock),
        practiceBlocks: practiceBlocks.map(mapToBlockResponseDto),
      };
    }, { timeout: 45_000 });
  }
}
