import type { ConfigService } from '@nestjs/config';
import { SigilController } from './sigil.controller';
import type { CreateSigilSessionService } from './services/create-sigil-session.service';
import type { ContinueSigilSessionService } from './services/continue-sigil-session.service';
import type { GenerateSigilBlockSequenceService } from './services/generate-sigil-block-sequence.service';

describe('SigilController.create', () => {
  const dto = { group: 'explainer', section: 'elements', lang: 'de' } as const;

  function setup(e2eTestToken?: string) {
    const createSigilSessionService = {
      create: jest.fn().mockResolvedValue({}),
    };
    const configService = { get: jest.fn().mockReturnValue(e2eTestToken) };
    const controller = new SigilController(
      createSigilSessionService as unknown as CreateSigilSessionService,
      {} as ContinueSigilSessionService,
      {} as GenerateSigilBlockSequenceService,
      configService as unknown as ConfigService,
    );
    return { controller, createSigilSessionService };
  }

  it('creates a regular session by default', async () => {
    const { controller, createSigilSessionService } = setup('secret');
    await controller.create({ ...dto });
    expect(createSigilSessionService.create).toHaveBeenCalledWith(
      'explainer',
      'elements',
      'de',
      false,
      undefined,
    );
  });

  it('passes the SoSci case through', async () => {
    const { controller, createSigilSessionService } = setup();
    await controller.create({ ...dto, sosciCase: '123' });
    expect(createSigilSessionService.create).toHaveBeenCalledWith(
      'explainer',
      'elements',
      'de',
      false,
      '123',
    );
  });

  it('marks a survey pretest (isTestRun: true) as test run, even without E2E_TEST_TOKEN configured', async () => {
    const { controller, createSigilSessionService } = setup(undefined);
    await controller.create({ ...dto, isTestRun: true, sosciCase: '5' });
    expect(createSigilSessionService.create).toHaveBeenCalledWith(
      'explainer',
      'elements',
      'de',
      true,
      '5',
    );
  });

  it('still marks smoke-test sessions via the header secret', async () => {
    const { controller, createSigilSessionService } = setup('secret');
    await controller.create({ ...dto }, 'secret');
    expect(createSigilSessionService.create).toHaveBeenCalledWith(
      'explainer',
      'elements',
      'de',
      true,
      undefined,
    );
  });

  it('ignores a wrong header secret', async () => {
    const { controller, createSigilSessionService } = setup('secret');
    await controller.create({ ...dto, isTestRun: false }, 'guess');
    expect(createSigilSessionService.create).toHaveBeenCalledWith(
      'explainer',
      'elements',
      'de',
      false,
      undefined,
    );
  });
});
