import { BlockType } from '../../domain/schemas/enums.schema';
import type { LearningGoal } from '../../domain/schemas/base/learning-goal.schema';
import { mapToBlockResponseDto } from '../shared/shared.utils';

////////////////////////////////////////////////////////////
// Session helpers (sessions module only)
////////////////////////////////////////////////////////////

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

/**
 * Pass threshold for a Sigil Explainer practice round: a student passes once at
 * least two thirds of the questions are correct (i.e. 2 of 3), rather than
 * needing a perfect score. Kept separate from areAllPracticeBlocksCorrect so the
 * non-sigil flow keeps requiring all answers correct.
 */
export const SIGIL_PRACTICE_PASS_RATIO = 2 / 3;

/** True if the share of correct practice blocks meets the pass ratio (default 2/3). */
export function arePracticeBlocksPassed(
  blocks: Array<{ type: BlockType; orderIndex: number; practiceBlock?: { studentAnswerIsCorrect: boolean | null } | null }>,
  passRatio: number = SIGIL_PRACTICE_PASS_RATIO,
): boolean {
  if (blocks.length === 0) return false;
  const correctCount = blocks.filter((b) => b.practiceBlock?.studentAnswerIsCorrect === true).length;
  return correctCount / blocks.length >= passRatio;
}

/** Finds first practice block in list that has not been answered yet by student */
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
