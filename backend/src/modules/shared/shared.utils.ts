import type { Prisma } from '@prisma/client';
import { BlockType, type MessageSender } from '../../domain/schemas/enums.schema';
import type { Block } from '../../domain/schemas/base/blocks/block.schema';
import type { WrongAnswer } from '../../domain/schemas/llm-parser/block-sequence.schema';

const BLOCKS_PER_SEQUENCE = 4; // 1 x inform block + 3 x practice block

/** Gets current number of block sequences in the session */
export function getBlockSequenceCounter(blocks: Array<{ type: BlockType }>): number {
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
 * Extracts wrong answers from practice blocks.
 * @param scope 'all' = all practice blocks of a session; 'lastSequence' = only 3 practice blocks of latest block sequence
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
  const practiceBlocks =
    scope === 'lastSequence'
      ? getCurrentBlockSequencePracticeBlocks(blocks)
      : blocks.filter((b) => b.type === BlockType.Practice);
  return practiceBlocks
    .filter((b) => b.practiceBlock?.studentAnswerIsCorrect === false)
    .map((b) => {
      const p = b.practiceBlock!;
      return {
        question: p.question,
        correctAnswerOptions: p.correctAnswerOptionIndices.map((i) => p.answerOptions[i]),
        wrongStudentAnswerOptions: p.studentAnswerOptionIndices.map((i) => p.answerOptions[i]),
      };
    });
}

/** Session duration in whole minutes (from startedAt to now) */
export function calculateSessionDurationMinutes(startedAt: Date): number {
  return Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000 / 60);
}

/** Maps any block type (inform, practice, summary) from DB-format to API-response format */
export function mapToBlockResponseDto(
  block:
    | Prisma.BlockGetPayload<{ include: { informBlock: { include: { messages: true } } } }>
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

/** Extracts JSON from text; handles markdown code blocks (```json or ```) and strips noise (backticks, whitespace, etc.) */
export function extractJsonFromMarkdown(text: string): string {
  let jsonText = text.trim();
  const codeBlockMatch = jsonText.match(/```(?:json|JSON)?\s*\n?([\s\S]*?)```/);
  if (codeBlockMatch) {
    jsonText = codeBlockMatch[1].trim();
  }
  jsonText = jsonText.replace(/^`+|`+$/g, '').trim();
  if (!jsonText.startsWith('{') && !jsonText.startsWith('[')) {
    const jsonObjectMatch = jsonText.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (jsonObjectMatch) {
      jsonText = jsonObjectMatch[1];
    }
  }
  return jsonText.trim();
}
