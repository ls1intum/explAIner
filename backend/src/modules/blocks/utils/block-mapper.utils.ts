/**
 * Block/session response helpers: Prisma block with includes → API response (strip nulls, serialize dates).
 */

import type { Prisma } from '@prisma/client';

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

/** Summary block + metadata → generate-summary-block response (Prisma-shaped block + sessionDuration, totalBlocks). */
export function mapPrismaSummaryBlockToGenerateResponse(
  block: BlockWithIncludes,
  sessionDuration: number,
  totalBlocks: number,
) {
  return { ...blockToResponse(block), sessionDuration, totalBlocks };
}

/** Chat response message → DTO */
export function mapChatResponse(message: string) {
  return { response: message };
}

/** Submit-answer response */
export function mapSubmitAnswerResponse(studentAnswerOptionIndices: number[]) {
  return { success: true as const, studentAnswerOptionIndices };
}
