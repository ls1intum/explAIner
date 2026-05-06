import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { DatabaseModule } from '../shared/database/database.module';
import { LlmModule } from '../shared/llm/llm.module';
import { SigilController } from './sigil.controller';
import { SigilContentLoader } from './content/sigil-content.loader';
import { CreateSigilSessionService } from './services/create-sigil-session.service';
import { ContinueSigilSessionService } from './services/continue-sigil-session.service';
import { GenerateSigilBlockSequenceService } from './services/generate-sigil-block-sequence.service';
import { GenerateSigilInitialPracticeService } from './services/generate-sigil-initial-practice.service';
import { GenerateSigilPracticeChain } from './llm/generate-sigil-practice.chain';
import { GenerateSigilSubsequentChain } from './llm/generate-sigil-subsequent.chain';

@Module({
  imports: [PrismaModule, DatabaseModule, LlmModule],
  controllers: [SigilController],
  providers: [
    SigilContentLoader,
    CreateSigilSessionService,
    ContinueSigilSessionService,
    GenerateSigilBlockSequenceService,
    GenerateSigilInitialPracticeService,
    GenerateSigilPracticeChain,
    GenerateSigilSubsequentChain,
  ],
})
export class SigilModule {}
