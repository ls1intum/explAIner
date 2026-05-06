import { Injectable, Logger } from '@nestjs/common';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import { SessionsRepository } from '../../shared/database/repositories/sessions.repository';
import { BlocksRepository } from '../../shared/database/repositories/blocks.repository';
import { AtomicDatabaseTransactionRunner } from '../../shared/database/database.transaction-runner';
import { SigilContentLoader } from '../content/sigil-content.loader';
import { GenerateSigilInitialPracticeService } from './generate-sigil-initial-practice.service';
import {
  SIGIL_MODE_CONFIG,
  SIGIL_TOPICS,
  SIGIL_LEARNING_GOALS,
  SIGIL_OWLBERT_GREETING,
  type SigilModeKey,
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
  async create(mode: SigilModeKey, lang: SigilLang) {
    const config = SIGIL_MODE_CONFIG[mode];
    const topic = SIGIL_TOPICS[lang];
    const learningGoal = SIGIL_LEARNING_GOALS[mode][lang];
    const [from, to] = config.sections;
    const markdownContent = this.contentLoader.getSections(lang, from, to);

    const sigilModeEnum = mode.charAt(0).toUpperCase() + mode.slice(1);

    // Phase A: Create session + verbatim inform block (no LLM, instant)
    const result = await this.atomicDbTx.run(async (tx) => {
      const session = await this.sessionsRepository.create({
        topic,
        learningGoal,
        learningGoalBloomsLevel: config.bloomsLevel ?? 'Understand',
        sigilMode: sigilModeEnum as any,
      }, tx);

      // Build inform block message: greeting + markdown content
      const greeting = SIGIL_OWLBERT_GREETING[lang];
      const informMessage = `${greeting}\n\n---\n\n${markdownContent}`;

      const informBlock = await this.blocksRepository.createInformBlock(
        session.id,
        0,
        informMessage,
        true,
        tx,
      );

      return { session, informBlock };
    }, { timeout: 10_000 });

    // Phase B: Async practice generation (modes a/b/c only, fire-and-forget)
    if (config.hasPractice && config.bloomsLevel) {
      this.generatePractice.generateAsync(
        result.session.id,
        markdownContent,
        learningGoal,
        config.bloomsLevel,
        lang,
      ).catch((err) => {
        this.logger.error(`Async practice generation failed for session ${result.session.id}: ${err.message}`);
      });
    }

    return {
      sessionId: result.session.id,
      mode,
      lang,
      hasPractice: config.hasPractice,
      informBlock: mapToBlockResponseDto(result.informBlock),
    };
  }
}
