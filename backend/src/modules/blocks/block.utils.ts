import { BlockType, type MessageSender } from '../../domain/schemas/enums.schema';
import type { Block } from '../../domain/schemas/base/blocks/block.schema';
import type { Prisma } from '@prisma/client';
import type { WrongAnswer } from '../../domain/schemas/base/blocks/practice-block.schema';





/** Block shape for wrong-answer extraction (practice block with answer data). */
type BlockWithPracticeAnswer = {
  type: BlockType;
  practiceBlock?: {
    question: string;
    answerOptions: string[];
    correctAnswerOptionIndices: number[];
    studentAnswerOptionIndices: number[];
    studentAnswerIsCorrect: boolean | null;
  } | null;
};



/** Prisma block with all relation includes (used by get-block, get-session, etc.). */
export type BlockWithIncludes = Prisma.BlockGetPayload<{
  include: {
    informBlock: { include: { messages: true } };
    practiceBlock: true;
    summaryBlock: true;
  };
}>;



////////////////////////////////////////////////////////////
// Block helpers
////////////////////////////////////////////////////////////

const BLOCKS_PER_SEQUENCE = 4; // 1 x inform block + 3 x practice block

/** Build conversation history string from messages; appends new user message if given. */
export function buildConversationHistory(
  messages: Array<{ sender: string; message: string }>,
  newUserMessage?: string,
): string {
  const lines = messages.map((msg) => `${msg.sender}: ${msg.message}`);
  if (newUserMessage) lines.push(`User: ${newUserMessage}`);
  return lines.join('\n');
}

/** Returns a copy of blocks sorted by orderIndex (for consistent API response order). */
export function sortBlocksByOrderIndex<T extends { orderIndex: number }>(
  blocks: T[],
): T[] {
  return [...blocks].sort((a, b) => a.orderIndex - b.orderIndex);
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
  blocks: BlockWithPracticeAnswer[],
): WrongAnswer[] {
  const lastSequenceBlocks = getCurrentBlockSequenceBlocks(blocks);
  const lastSequencePracticeBlocks = getPracticeBlocks(lastSequenceBlocks);
  return lastSequencePracticeBlocks
    .filter((block) => block.practiceBlock?.studentAnswerIsCorrect === false)
    .map(mapBlockToWrongAnswer);
}

/** Extracts all wrong answers from all practice blocks (e.g. for easier learning goals). */
export function extractWrongAnswersFromBlocks(
  blocks: BlockWithPracticeAnswer[],
): WrongAnswer[] {
  const practiceBlocks = getPracticeBlocks(blocks);
  return practiceBlocks
    .filter((block) => block.practiceBlock?.studentAnswerIsCorrect === false)
    .map(mapBlockToWrongAnswer);
}


/** Compare student answer indices to correct indices (order-independent match). */
export function isStudentAnswerCorrect(
  correctAnswerOptionIndices: number[],
  studentAnswerOptionIndices: number[],
): boolean {
  return (
    studentAnswerOptionIndices.length === correctAnswerOptionIndices.length &&
    studentAnswerOptionIndices.every((idx) =>
      correctAnswerOptionIndices.includes(idx),
    )
  );
}

/** Build inform block display text: explanation + label + key points + summary. */
export function formatInformBlockMessage(
  explanation: string,
  label: string,
  keyPoints: string[],
  summary: string,
): string {
  const keyPointsText = keyPoints.map((item) => `${item}`).join('\n');
  return `${explanation}\n\n${label}\n${keyPointsText}\n\nSUMMARY\n${summary}`;
}










////////////////////////////////////////////////////////////
// Block response mappers
////////////////////////////////////////////////////////////

/** Serialize block for JSON response: dates to ISO, omit null relation keys. Uses schema literals so return type matches Block. */
export function blockToResponse(block: BlockWithIncludes): Block {
  const base = {
    id: block.id,
    sessionId: block.sessionId,
    orderIndex: block.orderIndex,
    alreadyViewed: block.alreadyViewed,
  };
  if (block.type === 'Inform' && block.informBlock) {
    return {
      ...base,
      type: 'Inform',
      informBlock: {
        messages: block.informBlock.messages.map((msg) => ({
          id: msg.id,
          informBlockId: msg.informBlockId,
          message: msg.message,
          sender: msg.sender as MessageSender,
          timestamp: (msg.timestamp as Date).toISOString(),
        })),
      },
    };
  }
  if (block.type === 'Practice' && block.practiceBlock) {
    return { ...base, type: 'Practice', practiceBlock: block.practiceBlock };
  }
  if (block.type === 'Summary' && block.summaryBlock) {
    return { ...base, type: 'Summary', summaryBlock: block.summaryBlock };
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

function mapBlockToWrongAnswer(block: BlockWithPracticeAnswer): WrongAnswer {
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
}


/** Format wrong answers as strings for LLM prompts. */
export function formatWrongAnswersForPrompt(wrongAnswers: WrongAnswer[]): string[] {
  return wrongAnswers.map(
    (wa) =>
      `Question: ${wa.question}\nCorrect Answer(s): ${wa.correctAnswerOptions.join(', ')}\nStudent's Answer(s): ${wa.wrongStudentAnswerOptions.join(', ')}`,
  );
}

/** Concatenate all inform block messages into one string (covered content). */
export function getCoveredContentFromInformBlocks(
  blocks: Array<{
    type: BlockType;
    informBlock?: { messages: { message: string }[] } | null;
  }>,
): string {
  return blocks
    .filter((b) => b.type === BlockType.Inform && b.informBlock?.messages)
    .map((b) => b.informBlock!.messages.map((m) => m.message).join('\n'))
    .join('\n\n');
}
