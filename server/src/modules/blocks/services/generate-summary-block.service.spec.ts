import { GenerateSummaryBlockService } from './generate-summary-block.service';
import { LlmUnavailableError } from '../../shared/llm/llm.service';
import type { AtomicDatabaseTransactionRunner } from '../../shared/database/database.transaction-runner';
import type { SessionsRepository } from '../../shared/database/repositories/sessions.repository';
import type { BlocksRepository } from '../../shared/database/repositories/blocks.repository';
import type { GenerateSessionSummaryChain } from '../../shared/llm/chains/generate-session-summary.chain';

describe('GenerateSummaryBlockService', () => {
  const practice = (studentAnswerIsCorrect: boolean) => ({
    type: 'Practice',
    practiceBlock: { question: 'q', studentAnswerIsCorrect },
  });

  let chain: { execute: jest.Mock };
  let blocksRepository: { createSummaryBlock: jest.Mock };
  let service: GenerateSummaryBlockService;

  beforeEach(() => {
    const sessionsRepository = {
      getSessionWithAllBlocks: jest.fn().mockResolvedValue({
        topic: 'Aufbau eines Stadtsiegels',
        learningGoal: 'Ich kann die Elemente erklären.',
        learningGoalBloomsLevel: 'Understand',
        lang: 'de',
        totalBlocks: 4,
        startedAt: new Date(),
        blocks: [
          { type: 'Inform', informBlock: { messages: [{ message: 'material' }] } },
          practice(true),
          practice(false),
          practice(true),
        ],
      }),
      update: jest.fn(),
    };
    blocksRepository = {
      createSummaryBlock: jest.fn((sessionId: string, orderIndex: number, text: string) => ({
        id: 'summary',
        sessionId,
        orderIndex,
        alreadyViewed: false,
        type: 'Summary',
        summaryBlock: { blockId: 'summary', sessionSummary: text },
      })),
    };
    chain = { execute: jest.fn() };
    const atomicDbTx = { run: jest.fn((fn: (tx: unknown) => unknown) => fn({})) };

    service = new GenerateSummaryBlockService(
      atomicDbTx as unknown as AtomicDatabaseTransactionRunner,
      sessionsRepository as unknown as SessionsRepository,
      blocksRepository as unknown as BlocksRepository,
      chain as unknown as GenerateSessionSummaryChain,
    );
  });

  it('stores the LLM summary when the LLM answers', async () => {
    chain.execute.mockResolvedValue({ sessionSummary: 'LLM summary' });

    await service.generate('s1');

    expect(blocksRepository.createSummaryBlock).toHaveBeenCalledWith('s1', 4, 'LLM summary', {});
  });

  it('falls back to a fixed summary when the LLM does not answer', async () => {
    chain.execute.mockRejectedValue(new LlmUnavailableError('Request timed out.'));

    const result = await service.generate('s1');

    const text = blocksRepository.createSummaryBlock.mock.calls[0][2] as string;
    expect(text).toContain('**2 von 3**');
    expect(text).toContain('Ich kann die Elemente erklären.');
    expect(result.totalBlocks).toBe(5);
  });
});
