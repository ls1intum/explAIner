/**
 * Session utils: flow helpers, getSessionWithBlocks, and response mappers.
 */

import { NotFoundException } from '@nestjs/common';
import { BlockType } from '@prisma/client';
import type { PrismaService } from 'prisma/prisma.service';
import {
  blockToResponse,
  getBlockSequenceCounter,
  getCurrentBlockSequenceBlocks,
  getPracticeBlocks,
} from '../blocks/block.utils';
import type { BlockWithIncludes } from '../blocks/block.utils';

/** Block shape needed for session-flow helpers (session.blocks with practiceBlock included) */
export type SessionBlockWithPractice = {
  type: BlockType;
  orderIndex: number;
  practiceBlock?: { studentAnswerIsCorrect: boolean | null } | null;
};

export { getBlockSequenceCounter, getCurrentBlockSequenceBlocks, getPracticeBlocks };

export function areAllPracticeBlocksAnswered(
  blocks: SessionBlockWithPractice[],
): boolean {
  return blocks.every(
    (b) => b.practiceBlock?.studentAnswerIsCorrect !== null,
  );
}

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

/** Session with blocks (from get-session query) → get-session response shape */
export function mapSessionToGetResponse(session: {
  id: string;
  topic: string;
  priorKnowledge: string | null;
  learningGoal: string;
  learningGoalBloomsLevel: string;
  totalBlocks: number;
  currentBlockIndex: number;
  blocks: BlockWithIncludes[];
}) {
  return {
    id: session.id,
    topic: session.topic,
    priorKnowledge: session.priorKnowledge ?? undefined,
    learningGoal: {
      learningGoal: session.learningGoal,
      bloomsLevel: session.learningGoalBloomsLevel,
    },
    totalBlocks: session.totalBlocks,
    currentBlockIndex: session.currentBlockIndex,
    blocks: session.blocks.map((b) => blockToResponse(b)),
  };
}

/** Create-session response: session + dto + blocks (blocks already serialized). */
export function mapSessionToCreateResponse(
  session: { id: string },
  dto: { topic: string; priorKnowledge?: string; learningGoal: { learningGoal: string; bloomsLevel: string } },
  blocks: Array<ReturnType<typeof blockToResponse>>,
) {
  return {
    id: session.id,
    topic: dto.topic,
    priorKnowledge: dto.priorKnowledge ?? undefined,
    learningGoal: dto.learningGoal,
    totalBlocks: 4,
    currentBlockIndex: 0,
    blocks,
  };
}

export function mapContinueResponse(
  action: 'navigate' | 'next-sequence' | 'summary' | 'prompt-user',
  targetBlockIndex?: number,
) {
  return targetBlockIndex !== undefined
    ? { action, targetBlockIndex }
    : { action };
}

export function mapUpdateCurrentBlockIndexResponse(currentBlockIndex: number) {
  return { success: true as const, currentBlockIndex };
}

export function mapSubmitFeedbackResponse(rating: number) {
  return { success: true as const, rating };
}

export function mapDeleteSessionResponse() {
  return { success: true as const };
}
