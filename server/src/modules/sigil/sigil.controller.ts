import { Controller, Post, Body, Param, Query, Headers } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiHeader } from '@nestjs/swagger';
import { CreateSigilSessionService } from './services/create-sigil-session.service';
import { ContinueSigilSessionService } from './services/continue-sigil-session.service';
import { GenerateSigilBlockSequenceService } from './services/generate-sigil-block-sequence.service';
import { CreateSigilSessionRequestDto } from './dto/create-sigil-session.request.dto';
import type { SigilLang } from './sigil.config';

/**
 * Header carrying the shared secret (E2E_TEST_TOKEN) that flags a session as
 * created by the automated smoke test rather than a study participant.
 */
export const E2E_TEST_TOKEN_HEADER = 'x-e2e-test-token';

@ApiTags('sigil')
@Controller('sigil')
export class SigilController {
  constructor(
    private readonly createSigilSessionService: CreateSigilSessionService,
    private readonly continueSigilSessionService: ContinueSigilSessionService,
    private readonly generateSigilBlockSequenceService: GenerateSigilBlockSequenceService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * True when the request carries the configured smoke-test secret.
   * Returns false whenever E2E_TEST_TOKEN is unset, so a session can never be
   * marked as test data by accident (or by an outside caller guessing a header).
   */
  private isTestRun(headerValue?: string): boolean {
    const expected = this.configService.get<string>('e2eTestToken');
    return !!expected && headerValue === expected;
  }

  @Post('sessions')
  @ApiOperation({ summary: 'Create a sigil session', description: 'Creates a sigil learning session with group (explainer/chat/text) and section (elements)' })
  @ApiHeader({
    name: E2E_TEST_TOKEN_HEADER,
    required: false,
    description: 'Shared secret (E2E_TEST_TOKEN) flagging the session as smoke-test data',
  })
  create(
    @Body() dto: CreateSigilSessionRequestDto,
    @Headers(E2E_TEST_TOKEN_HEADER) e2eTestToken?: string,
  ) {
    return this.createSigilSessionService.create(
      dto.group,
      dto.section,
      dto.lang,
      this.isTestRun(e2eTestToken),
    );
  }

  @Post('sessions/:sessionId/continue')
  @ApiOperation({ summary: 'Continue sigil session', description: 'Determines next action for a sigil session' })
  @ApiParam({ name: 'sessionId', description: 'Sigil session identifier' })
  continue(@Param('sessionId') sessionId: string) {
    return this.continueSigilSessionService.continue(sessionId);
  }

  @Post('sessions/:sessionId/blocks/sequence')
  @ApiOperation({ summary: 'Generate sigil subsequent sequence', description: 'Generates a new block sequence for a sigil session after wrong answers' })
  @ApiParam({ name: 'sessionId', description: 'Sigil session identifier' })
  @ApiQuery({ name: 'lang', required: false, enum: ['de', 'en'] })
  generateSequence(
    @Param('sessionId') sessionId: string,
    @Query('lang') lang: SigilLang = 'de',
  ) {
    return this.generateSigilBlockSequenceService.generate(sessionId, lang);
  }
}
