import { NotFoundException } from '@nestjs/common';
import { BlockType } from '@prisma/client';
import type { PrismaService } from 'prisma/prisma.service';

/** One block sequence = 1 INFORM + 3 PRACTICE blocks */
const BLOCKS_PER_SEQUENCE = 4;

/** Block shape needed for session-flow helpers (session.blocks with practiceBlock included) */
export type SessionBlockWithPractice = {
  type: BlockType;
  orderIndex: number;
  practiceBlock?: { studentAnswerIsCorrect: boolean | null } | null;
};

/** Number of completed block sequences (= number of INFORM blocks) */
export function getBlockSequenceCounter(
  blocks: Array<{ type: BlockType }>,
): number {
  return blocks.filter((b) => b.type === BlockType.Inform).length;
}

/** Last 4 blocks: current sequence (1 INFORM + 3 PRACTICE) */
export function getCurrentBlockSequenceBlocks<T extends { type: BlockType }>(
  blocks: T[],
): T[] {
  const count = getBlockSequenceCounter(blocks);
  if (count === 0) return [];
  const start = (count - 1) * BLOCKS_PER_SEQUENCE;
  return blocks.slice(start, start + BLOCKS_PER_SEQUENCE);
}

/** Practice blocks from a slice (e.g. current sequence) */
export function getPracticeBlocks<T extends { type: BlockType }>(
  blocks: T[],
): T[] {
  return blocks.filter((b) => b.type === BlockType.Practice) as T[];
}

/** True if every practice block has an answer (correct or not) */
export function areAllPracticeBlocksAnswered(
  blocks: SessionBlockWithPractice[],
): boolean {
  return blocks.every(
    (b) => b.practiceBlock?.studentAnswerIsCorrect !== null,
  );
}

/** True if every practice block was answered correctly */
export function areAllPracticeBlocksCorrect(
  blocks: SessionBlockWithPractice[],
): boolean {
  return blocks.every(
    (b) => b.practiceBlock?.studentAnswerIsCorrect === true,
  );
}

/** First practice block in list that has no answer yet */
export function findNextUnansweredPracticeBlock(
  blocks: SessionBlockWithPractice[],
): SessionBlockWithPractice | undefined {
  return blocks.find(
    (b) =>
      b.type === BlockType.Practice &&
      b.practiceBlock?.studentAnswerIsCorrect === null,
  );
}

/** Session with blocks (practiceBlock included), ordered by orderIndex. Throws if not found. */
export async function getSessionWithBlocks(
  prisma: PrismaService,
  sessionId: string,
) {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      blocks: {
        include: { practiceBlock: true },
        orderBy: { orderIndex: 'asc' },
      },
    },
  });
  if (!session) throw new NotFoundException('Session not found');
  return session;
}
