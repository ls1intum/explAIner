import { Injectable } from '@nestjs/common';
import type { SigilMode } from '@prisma/client';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import { SessionsRepository } from '../../shared/database/repositories/sessions.repository';
import { BlocksRepository } from '../../shared/database/repositories/blocks.repository';
import { AtomicDatabaseTransactionRunner } from '../../shared/database/database.transaction-runner';
import { SigilContentLoader } from '../content/sigil-content.loader';
import { GenerateSigilInitialPracticeService } from './generate-sigil-initial-practice.service';
import {
  SIGIL_GROUP_CONFIG,
  SIGIL_SECTION_CONFIG,
  SIGIL_TOPICS,
  SIGIL_LEARNING_GOALS,
  SIGIL_OWLBERT_GREETING,
  toSigilModeEnum,
  type SigilGroupKey,
  type SigilSectionKey,
  type SigilLang,
} from '../sigil.config';
import { mapToBlockResponseDto } from '../../shared/shared.utils';

@Injectable()
export class CreateSigilSessionService {
  constructor(
    private atomicDbTx: AtomicDatabaseTransactionRunner,
    private sessionsRepository: SessionsRepository,
    private blocksRepository: BlocksRepository,
    private contentLoader: SigilContentLoader,
    private generatePractice: GenerateSigilInitialPracticeService,
  ) {}

  @LogService()
  async create(
    group: SigilGroupKey,
    section: SigilSectionKey,
    lang: SigilLang,
    isTestRun = false,
    sosciCase?: string,
  ) {
    const groupConfig = SIGIL_GROUP_CONFIG[group];
    const sectionConfig = SIGIL_SECTION_CONFIG[section];
    const topic = SIGIL_TOPICS[lang];
    const learningGoal = SIGIL_LEARNING_GOALS[section][lang];
    const markdownContent = this.contentLoader.getSections(lang, ...sectionConfig.displaySections);
    // Practice is built from the taught sections only, so no question targets the out-of-scope note.
    const practiceContent = this.contentLoader.getSections(lang, ...sectionConfig.sections);

    const sigilModeEnum = toSigilModeEnum(group) as SigilMode;

    // Survey reload / back navigation: the iframe is opened again with the same
    // case number. Resume that participant's session instead of starting over.
    if (sosciCase) {
      const resumed = await this.resumeBySosciCase(
        sosciCase,
        sigilModeEnum,
        group,
        section,
        lang,
        isTestRun,
      );
      if (resumed) return resumed;
    }

    // Phase A: Create session + verbatim inform block (no LLM, instant)
    const result = await this.atomicDbTx.run(async (tx) => {
      const session = await this.sessionsRepository.create({
        topic,
        learningGoal,
        learningGoalBloomsLevel: sectionConfig.bloomsLevel,
        sigilMode: sigilModeEnum,
        lang,
        isTestRun,
        sosciCase: sosciCase ?? null,
      }, tx);

      // Build inform block message: greeting + markdown content
      const greeting = SIGIL_OWLBERT_GREETING[lang];
      const informMessage = groupConfig.hasChat
        ? `${greeting}\n\n---\n\n${markdownContent}`
        : markdownContent;

      const informBlock = await this.blocksRepository.createInformBlock(
        session.id,
        0,
        informMessage,
        true,
        tx,
      );

      return { session, informBlock };
    }, { timeout: 10_000 });

    // Phase B: Async practice generation (explainer group only, fire-and-forget;
    // a failure is stored on the session and surfaced to the polling client)
    if (groupConfig.hasPractice) {
      this.generatePractice.start(
        result.session.id,
        practiceContent,
        learningGoal,
        sectionConfig.bloomsLevel,
        lang,
      );
    }

    return {
      sessionId: result.session.id,
      group,
      section,
      lang,
      hasPractice: groupConfig.hasPractice,
      hasChat: groupConfig.hasChat,
      // Echoed back so the smoke test can verify its own sessions really were
      // marked (a silently mistyped secret would otherwise go unnoticed).
      isTestRun,
      resumed: false,
      informBlock: mapToBlockResponseDto(result.informBlock),
    };
  }

  /**
   * Returns the existing session for this case in the same group, language and
   * test/real split (same response shape as a new one), or null if there is
   * none. Practice generation is not started again: it is either still running,
   * finished, or its failure is stored on the session.
   */
  private async resumeBySosciCase(
    sosciCase: string,
    sigilMode: SigilMode,
    group: SigilGroupKey,
    section: SigilSectionKey,
    lang: SigilLang,
    isTestRun: boolean,
  ) {
    const session =
      await this.sessionsRepository.findLatestSigilSessionBySosciCase({
        sosciCase,
        sigilMode,
        lang,
        isTestRun,
      });
    if (!session) return null;

    const informBlock =
      await this.blocksRepository.findBlockBySessionIdAndOrderIndex(
        session.id,
        0,
      );
    if (!informBlock) return null;

    const groupConfig = SIGIL_GROUP_CONFIG[group];
    return {
      sessionId: session.id,
      group,
      section,
      lang,
      hasPractice: groupConfig.hasPractice,
      hasChat: groupConfig.hasChat,
      isTestRun: session.isTestRun,
      resumed: true,
      informBlock: mapToBlockResponseDto(informBlock),
    };
  }
}
