import { NotFoundException } from '@nestjs/common';
import { BlockType } from '../../domain/schemas/enums.schema';
import type { LearningGoal } from '../../domain/schemas/base/learning-goal.schema';
import type { PrismaService } from 'prisma/prisma.service';
import {
  mapToBlockResponseDto,
  getBlockSequenceCounter,
  getCurrentBlockSequenceBlocks,
  getPracticeBlocks,
} from '../blocks/block.utils';
import type { BlockWithIncludes } from '../blocks/block.utils';

export { getBlockSequenceCounter, getCurrentBlockSequenceBlocks, getPracticeBlocks };

////////////////////////////////////////////////////////////
// Session helpers
////////////////////////////////////////////////////////////

/** Ensures session exists, throws NotFoundException if not found */
export async function requireSessionExists(
  prisma: PrismaService,
  sessionId: string,
): Promise<{ id: string }> {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { id: true },
  });
  if (!session) {
    throw new NotFoundException(`Session with ID ${sessionId} not found`);
  }
  return session;
}

/** Gets full session including all blocks, throws if not found */
export async function getSessionWithAllBlocks(prisma: PrismaService, sessionId: string) {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      blocks: {
        orderBy: { orderIndex: 'asc' },
        include: {
          informBlock: {
            include: { messages: { orderBy: { timestamp: 'asc' } } },
          },
          practiceBlock: true,
          summaryBlock: true,
        },
      },
    },
  });
  if (!session) throw new NotFoundException(`Session with ID ${sessionId} not found`);
  return session;
}

/** Calculates session duration in whole minutes */
export function calculateSessionDurationMinutes(session: {
  startedAt: Date;
}): number {
  return Math.floor(
    (Date.now() - new Date(session.startedAt).getTime()) / 1000 / 60,
  );
}

/** True if every practice block has studentAnswerIsCorrect !== null */
export function areAllPracticeBlocksAnswered(
  blocks: Array<{ type: BlockType; orderIndex: number; practiceBlock?: { studentAnswerIsCorrect: boolean | null } | null }>,
): boolean {
  return blocks.every((b) => b.practiceBlock?.studentAnswerIsCorrect !== null);
}

/** True if every practice block has studentAnswerIsCorrect === true */
export function areAllPracticeBlocksCorrect(
  blocks: Array<{ type: BlockType; orderIndex: number; practiceBlock?: { studentAnswerIsCorrect: boolean | null } | null }>,
): boolean {
  return blocks.every((b) => b.practiceBlock?.studentAnswerIsCorrect === true);
}

/** Finds first practice block in list that has no been answered yet by student */
export function findNextUnansweredPracticeBlock(
  blocks: Array<{ type: BlockType; orderIndex: number; practiceBlock?: { studentAnswerIsCorrect: boolean | null } | null }>,
): { type: BlockType; orderIndex: number; practiceBlock?: { studentAnswerIsCorrect: boolean | null } | null } | undefined {
  return blocks.find(
    (b) =>
      b.type === BlockType.Practice &&
      b.practiceBlock?.studentAnswerIsCorrect === null,
  );
}

////////////////////////////////////////////////////////////
// Session response mappers
////////////////////////////////////////////////////////////

/** Maps from DB-format to API-response format */
export function mapToGetSessionResponseDto(session: {
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
    blocks: session.blocks.map((b) => mapToBlockResponseDto(b)),
  };
}

/** Maps from DB-format to API-response format */
export function mapToCreateSessionResponseDto(
  session: { id: string },
  dto: { topic: string; priorKnowledge?: string; learningGoal: LearningGoal },
  blocks: Array<ReturnType<typeof mapToBlockResponseDto>>,
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

/** Maps from DB-format to API-response format */
export function mapToContinueSessionResponseDto(
  action: 'navigate' | 'next-sequence' | 'summary' | 'prompt-user',
  targetBlockIndex?: number,
) {
  return targetBlockIndex !== undefined
    ? { action, targetBlockIndex }
    : { action };
}