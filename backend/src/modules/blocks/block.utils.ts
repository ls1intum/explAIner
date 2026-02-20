/**
 * Block utils: response mappers, summary context, and wrong-answer extraction.
 */

import { BlockType } from '@prisma/client';
import type { Prisma } from '@prisma/client';
import type { WrongAnswer } from '../../domain/schemas/blocks/practice/practice-block.schema';

/** One block sequence = 1 INFORM + 3 PRACTICE blocks */
const BLOCKS_PER_SEQUENCE = 4;

/** Prisma block with all relation includes (used by get-block, get-session, etc.). */
export type BlockWithIncludes = Prisma.BlockGetPayload<{
  include: {
    informBlock: { include: { messages: true } };
    practiceBlock: true;
    summaryBlock: true;
  };
}>;

/** Serialize block for JSON response: dates to ISO, omit null relation keys. */
export function blockToResponse(block: BlockWithIncludes) {
  const base = {
    id: block.id,
    sessionId: block.sessionId,
    orderIndex: block.orderIndex,
    alreadyViewed: block.alreadyViewed,
    type: block.type,
  };
  if (block.type === 'Inform' && block.informBlock) {
    return {
      ...base,
      informBlock: {
        messages: block.informBlock.messages.map((msg) => ({
          ...msg,
          timestamp: (msg.timestamp as Date).toISOString(),
        })),
      },
    };
  }
  if (block.type === 'Practice' && block.practiceBlock) {
    return { ...base, practiceBlock: block.practiceBlock };
  }
  if (block.type === 'Summary' && block.summaryBlock) {
    return { ...base, summaryBlock: block.summaryBlock };
  }
  throw new Error('Invalid block type or missing block content');
}

/** Session blocks → { informContent, practiceResults } for summary chain */
export function mapSessionBlocksToSummaryContext(blocks: Array<{ type: string; informBlock?: { messages?: { message?: string }[] } | null; practiceBlock?: { question: string; studentAnswerIsCorrect: boolean | null } | null }>) {
  const informContent = blocks
    .filter((b) => b.type === 'Inform' && b.informBlock?.messages)
    .map((b) => b.informBlock!.messages![0]?.message ?? '');
  const practiceResults = blocks
    .filter((b) => b.type === 'Practice' && b.practiceBlock)
    .map((b) => ({
      question: b.practiceBlock!.question,
      isCorrect: b.practiceBlock!.studentAnswerIsCorrect ?? false,
    }));
  return { informContent, practiceResults };
}

/** Summary block + metadata → generate-summary-block response */
export function mapPrismaSummaryBlockToGenerateResponse(
  block: BlockWithIncludes,
  sessionDuration: number,
  totalBlocks: number,
) {
  return { ...blockToResponse(block), sessionDuration, totalBlocks };
}

export function mapChatResponse(message: string) {
  return { response: message };
}

export function mapSubmitAnswerResponse(studentAnswerOptionIndices: number[]) {
  return { success: true as const, studentAnswerOptionIndices };
}

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

/** Extracts wrong answers from the last sequence of practice blocks (for subsequent block sequences). */
export function extractWrongAnswersFromLastSequence(
  blocks: Array<{
    type: BlockType;
    practiceBlock?: {
      question: string;
      answerOptions: string[];
      correctAnswerOptionIndices: number[];
      studentAnswerOptionIndices: number[];
      studentAnswerIsCorrect: boolean | null;
    } | null;
  }>,
): WrongAnswer[] {
  const lastSequenceBlocks = getCurrentBlockSequenceBlocks(blocks);
  const lastSequencePracticeBlocks = getPracticeBlocks(lastSequenceBlocks);

  return lastSequencePracticeBlocks
    .filter((block) => block.practiceBlock?.studentAnswerIsCorrect === false)
    .map((block) => {
      const pb = block.practiceBlock!;
      return {
        question: pb.question,
        correctAnswerOptions: pb.correctAnswerOptionIndices.map(
          (idx) => pb.answerOptions[idx],
        ),
        wrongStudentAnswerOptions: pb.studentAnswerOptionIndices.map(
          (idx) => pb.answerOptions[idx],
        ),
      };
    });
}
