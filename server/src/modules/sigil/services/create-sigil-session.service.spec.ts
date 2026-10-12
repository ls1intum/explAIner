import { CreateSigilSessionService } from './create-sigil-session.service';
import type { AtomicDatabaseTransactionRunner } from '../../shared/database/database.transaction-runner';
import type { SessionsRepository } from '../../shared/database/repositories/sessions.repository';
import type { BlocksRepository } from '../../shared/database/repositories/blocks.repository';
import type { SigilContentLoader } from '../content/sigil-content.loader';
import type { GenerateSigilInitialPracticeService } from './generate-sigil-initial-practice.service';

describe('CreateSigilSessionService', () => {
  const informBlock = {
    id: 'block-0',
    sessionId: 'session-new',
    orderIndex: 0,
    alreadyViewed: true,
    type: 'Inform',
    informBlock: {
      blockId: 'block-0',
      messages: [
        {
          id: 'msg-1',
          informBlockId: 'block-0',
          message: 'material',
          sender: 'Owlbert',
          timestamp: new Date('2026-10-12T10:00:00Z'),
        },
      ],
    },
  };

  let sessionsRepository: {
    create: jest.Mock;
    findLatestSigilSessionBySosciCase: jest.Mock;
  };
  let blocksRepository: {
    createInformBlock: jest.Mock;
    findBlockBySessionIdAndOrderIndex: jest.Mock;
  };
  let generatePractice: { start: jest.Mock };
  let service: CreateSigilSessionService;

  beforeEach(() => {
    sessionsRepository = {
      create: jest.fn().mockResolvedValue({ id: 'session-new' }),
      findLatestSigilSessionBySosciCase: jest.fn().mockResolvedValue(null),
    };
    blocksRepository = {
      createInformBlock: jest.fn().mockResolvedValue(informBlock),
      findBlockBySessionIdAndOrderIndex: jest.fn(),
    };
    generatePractice = { start: jest.fn() };
    const atomicDbTx = {
      run: jest.fn((fn: (tx: unknown) => unknown) => fn({})),
    };
    const contentLoader = {
      getSections: jest.fn().mockReturnValue('material'),
    };

    service = new CreateSigilSessionService(
      atomicDbTx as unknown as AtomicDatabaseTransactionRunner,
      sessionsRepository as unknown as SessionsRepository,
      blocksRepository as unknown as BlocksRepository,
      contentLoader as unknown as SigilContentLoader,
      generatePractice as unknown as GenerateSigilInitialPracticeService,
    );
  });

  describe('without a SoSci case', () => {
    it('creates a new session and never looks for an existing one', async () => {
      const result = await service.create('explainer', 'elements', 'de');

      expect(
        sessionsRepository.findLatestSigilSessionBySosciCase,
      ).not.toHaveBeenCalled();
      expect(sessionsRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          sigilMode: 'Elements',
          lang: 'de',
          isTestRun: false,
          sosciCase: null,
        }),
        expect.anything(),
      );
      expect(generatePractice.start).toHaveBeenCalledTimes(1);
      expect(result).toMatchObject({
        sessionId: 'session-new',
        group: 'explainer',
        section: 'elements',
        lang: 'de',
        hasPractice: true,
        hasChat: true,
        isTestRun: false,
        resumed: false,
        informBlock: { id: 'block-0', orderIndex: 0, type: 'Inform' },
      });
    });

    it('stores the test-run flag', async () => {
      await service.create('text', 'elements', 'en', true);

      expect(sessionsRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          sigilMode: 'Text',
          lang: 'en',
          isTestRun: true,
        }),
        expect.anything(),
      );
      expect(generatePractice.start).not.toHaveBeenCalled();
    });
  });

  describe('with a SoSci case', () => {
    it('creates a new session storing the case when none exists yet', async () => {
      const result = await service.create(
        'chat',
        'elements',
        'de',
        false,
        '4711',
      );

      expect(
        sessionsRepository.findLatestSigilSessionBySosciCase,
      ).toHaveBeenCalledWith({
        sosciCase: '4711',
        sigilMode: 'Chat',
        lang: 'de',
        isTestRun: false,
      });
      expect(sessionsRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ sigilMode: 'Chat', sosciCase: '4711' }),
        expect.anything(),
      );
      expect(result.resumed).toBe(false);
    });

    it('resumes the existing session of the same case instead of creating a duplicate', async () => {
      sessionsRepository.findLatestSigilSessionBySosciCase.mockResolvedValue({
        id: 'session-existing',
        isTestRun: false,
      });
      blocksRepository.findBlockBySessionIdAndOrderIndex.mockResolvedValue({
        ...informBlock,
        sessionId: 'session-existing',
        practiceBlock: null,
        summaryBlock: null,
      });

      const result = await service.create(
        'explainer',
        'elements',
        'de',
        false,
        '4711',
      );

      expect(
        blocksRepository.findBlockBySessionIdAndOrderIndex,
      ).toHaveBeenCalledWith('session-existing', 0);
      expect(sessionsRepository.create).not.toHaveBeenCalled();
      expect(blocksRepository.createInformBlock).not.toHaveBeenCalled();
      // Practice is not generated a second time for a resumed session.
      expect(generatePractice.start).not.toHaveBeenCalled();
      expect(result).toMatchObject({
        sessionId: 'session-existing',
        group: 'explainer',
        section: 'elements',
        lang: 'de',
        hasPractice: true,
        hasChat: true,
        isTestRun: false,
        resumed: true,
        informBlock: {
          id: 'block-0',
          sessionId: 'session-existing',
          orderIndex: 0,
          type: 'Inform',
        },
      });
    });

    it('returns the same response keys for a resumed and a new session', async () => {
      const created = await service.create(
        'explainer',
        'elements',
        'de',
        false,
        '1',
      );

      sessionsRepository.findLatestSigilSessionBySosciCase.mockResolvedValue({
        id: 'session-existing',
        isTestRun: false,
      });
      blocksRepository.findBlockBySessionIdAndOrderIndex.mockResolvedValue(
        informBlock,
      );
      const resumed = await service.create(
        'explainer',
        'elements',
        'de',
        false,
        '1',
      );

      expect(Object.keys(resumed).sort()).toEqual(Object.keys(created).sort());
    });

    it('looks the case up per group, language and test flag', async () => {
      await service.create('text', 'elements', 'en', true, '99');

      expect(
        sessionsRepository.findLatestSigilSessionBySosciCase,
      ).toHaveBeenCalledWith({
        sosciCase: '99',
        sigilMode: 'Text',
        lang: 'en',
        isTestRun: true,
      });
    });

    it('creates a new session if the found session has no inform block', async () => {
      sessionsRepository.findLatestSigilSessionBySosciCase.mockResolvedValue({
        id: 'session-broken',
        isTestRun: false,
      });
      blocksRepository.findBlockBySessionIdAndOrderIndex.mockResolvedValue(
        null,
      );

      const result = await service.create('chat', 'elements', 'de', false, '7');

      expect(sessionsRepository.create).toHaveBeenCalledTimes(1);
      expect(result).toMatchObject({
        sessionId: 'session-new',
        resumed: false,
      });
    });
  });
});
