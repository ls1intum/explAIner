import { BlockType, type MessageSender } from '../../domain/schemas/enums.schema';
import type { Block } from '../../domain/schemas/base/blocks/block.schema';
import type { Prisma } from '@prisma/client';
import type { WrongAnswer } from '../../domain/schemas/llm-parser/block-sequence.schema';

////////////////////////////////////////////////////////////
// Block helpers
////////////////////////////////////////////////////////////

const BLOCKS_PER_SEQUENCE = 4; // 1 x inform block + 3 x practice block

/** Build chat history from all messages on a inform block */
export function buildChatHistory(
  messages: Array<{ sender: string; message: string }>,
  newUserMessage?: string,
): string {
  const lines = messages.map((msg) => `${msg.sender}: ${msg.message}`);
  if (newUserMessage) lines.push(`User: ${newUserMessage}`);
  return lines.join('\n');
}

/** Build context for session summary text */
export function buildContextForSessionSummary(blocks: Array<{ type: string; informBlock?: { messages?: { message?: string }[] } | null; practiceBlock?: { question: string; studentAnswerIsCorrect: boolean | null } | null }>) {
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

/** Gets current number of block sequences in the session */
export function getBlockSequenceCounter(
  blocks: Array<{ type: BlockType }>,
): number {
  return blocks.filter((b) => b.type === BlockType.Inform).length;
}

/** Gets all 3 practice blocks of the current (latest) block sequence */
export function getCurrentBlockSequencePracticeBlocks<T extends { type: BlockType }>(
  blocks: T[],
): T[] {
  const count = getBlockSequenceCounter(blocks);
  if (count === 0) return [];
  const start = (count - 1) * BLOCKS_PER_SEQUENCE;
  const sequenceBlocks = blocks.slice(start, start + BLOCKS_PER_SEQUENCE);
  return sequenceBlocks.filter((b) => b.type === BlockType.Practice) as T[];
}

/**
 * Extracts wrong answers from practice blocks
 * @param scope 'all' = all practice blocks of a session; 'lastSequence' = only 3 practice blocks a block sequence
 */
export function extractWrongAnswersFromPracticeBlocks(
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
  scope: 'all' | 'lastSequence',
): WrongAnswer[] {
  // filter practice blocks
  const practiceBlocks =
    scope === 'lastSequence'
      ? getCurrentBlockSequencePracticeBlocks(blocks)
      : blocks.filter((b) => b.type === BlockType.Practice);
  // filter again to only keep practice blocks where the student answered incorrectly
  return practiceBlocks
    .filter((b) => b.practiceBlock?.studentAnswerIsCorrect === false)
    .map((b) => {
      const p = b.practiceBlock!;
      // map to WrongAnswer schema
      return {
        question: p.question,
        correctAnswerOptions: p.correctAnswerOptionIndices.map((i) => p.answerOptions[i]),
        wrongStudentAnswerOptions: p.studentAnswerOptionIndices.map((i) => p.answerOptions[i]),
      };
    });
}

/** Format WrongAnswer schema to strings inserted into LLM prompt (generate-easier-learning-goals) */
export function formatWrongAnswersForPrompt(wrongAnswers: WrongAnswer[]): string[] {
  return wrongAnswers.map(
    (wa) =>
      `Question: ${wa.question}\nCorrect Answer(s): ${wa.correctAnswerOptions.join(', ')}\nStudent's Answer(s): ${wa.wrongStudentAnswerOptions.join(', ')}`,
  );
}

/** Format inform block display text: explanation + label <-> key points + summary */
export function formatInformBlockMessage(
  explanation: string,
  label: string,
  keyPoints: string[],
  summary: string,
): string {
  const keyPointsText = keyPoints.map((item) => `${item}`).join('\n');
  return `${explanation}\n\n${label}\n${keyPointsText}\n\nSUMMARY\n${summary}`;
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



////////////////////////////////////////////////////////////
// Block response mappers
////////////////////////////////////////////////////////////

/** Maps any block type (inform, practice, summary) from DB-format to API-response format */
export function mapToBlockResponseDto(
  block:
    | Prisma.BlockGetPayload<{ include: { informBlock: { include: { messages: true } } };}>
    | Prisma.BlockGetPayload<{ include: { practiceBlock: true } }>
    | Prisma.BlockGetPayload<{ include: { summaryBlock: true } }>,
): Block {
  const base = {
    id: block.id,
    sessionId: block.sessionId,
    orderIndex: block.orderIndex,
    alreadyViewed: block.alreadyViewed,
  };
  if (block.type === 'Inform' && 'informBlock' in block && block.informBlock) {
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
  if (block.type === 'Practice' && 'practiceBlock' in block && block.practiceBlock) {
    return { ...base, type: 'Practice', practiceBlock: block.practiceBlock };
  }
  if (block.type === 'Summary' && 'summaryBlock' in block && block.summaryBlock) {
    return { ...base, type: 'Summary', summaryBlock: block.summaryBlock };
  }
  throw new Error('Invalid block type or missing block content');
}