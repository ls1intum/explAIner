import { Controller, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateSigilSessionService } from './services/create-sigil-session.service';
import { ContinueSigilSessionService } from './services/continue-sigil-session.service';
import { GenerateSigilBlockSequenceService } from './services/generate-sigil-block-sequence.service';
import { CreateSigilSessionRequestDto } from './dto/create-sigil-session.request.dto';
import type { SigilLang } from './sigil.config';

@ApiTags('sigil')
@Controller('sigil')
export class SigilController {
  constructor(
    private readonly createSigilSessionService: CreateSigilSessionService,
    private readonly continueSigilSessionService: ContinueSigilSessionService,
    private readonly generateSigilBlockSequenceService: GenerateSigilBlockSequenceService,
  ) {}

  @Post('sessions')
  @ApiOperation({ summary: 'Create a sigil session', description: 'Creates a sigil learning session with group (explainer/chat/text) and section (elements/details/all)' })
  create(@Body() dto: CreateSigilSessionRequestDto) {
    return this.createSigilSessionService.create(dto.group, dto.section, dto.lang);
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
