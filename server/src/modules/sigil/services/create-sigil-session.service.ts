import { Injectable, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(CreateSigilSessionService.name);

  constructor(
    private atomicDbTx: AtomicDatabaseTransactionRunner,
    private sessionsRepository: SessionsRepository,
    private blocksRepository: BlocksRepository,
    private contentLoader: SigilContentLoader,
    private generatePractice: GenerateSigilInitialPracticeService,
  ) {}

  @LogService()
  async create(group: SigilGroupKey, section: SigilSectionKey, lang: SigilLang) {
    const groupConfig = SIGIL_GROUP_CONFIG[group];
    const sectionConfig = SIGIL_SECTION_CONFIG[section];
    const topic = SIGIL_TOPICS[lang];
    const learningGoal = SIGIL_LEARNING_GOALS[section][lang];
    const [from, to] = sectionConfig.sections;
    const markdownContent = this.contentLoader.getSections(lang, from, to);

    const sigilModeEnum = toSigilModeEnum(group, section);

    // Phase A: Create session + verbatim inform block (no LLM, instant)
    const result = await this.atomicDbTx.run(async (tx) => {
      const session = await this.sessionsRepository.create({
        topic,
        learningGoal,
        learningGoalBloomsLevel: sectionConfig.bloomsLevel,
        sigilMode: sigilModeEnum as any,
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

    // Phase B: Async practice generation (explainer group only, fire-and-forget)
    if (groupConfig.hasPractice) {
      this.generatePractice.generateAsync(
        result.session.id,
        markdownContent,
        learningGoal,
        sectionConfig.bloomsLevel,
        lang,
      ).catch((err) => {
        this.logger.error(`Async practice generation failed for session ${result.session.id}: ${err.message}`);
      });
    }

    return {
      sessionId: result.session.id,
      group,
      section,
      lang,
      hasPractice: groupConfig.hasPractice,
      hasChat: groupConfig.hasChat,
      informBlock: mapToBlockResponseDto(result.informBlock),
    };
  }
}
