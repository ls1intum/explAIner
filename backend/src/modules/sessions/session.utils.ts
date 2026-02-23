import { BlockType } from '../../domain/schemas/enums.schema';
import type { LearningGoal } from '../../domain/schemas/base/learning-goal.schema';
import { mapToBlockResponseDto } from '../blocks/block.utils';

////////////////////////////////////////////////////////////
// Session helpers
////////////////////////////////////////////////////////////

/** Calculates session duration in whole minutes (from startedAt to now) */
export function calculateSessionDurationMinutes(startedAt: Date): number {
  return Math.floor(
    (Date.now() - new Date(startedAt).getTime()) / 1000 / 60,
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
  blocks: Parameters<typeof mapToBlockResponseDto>[0][];
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