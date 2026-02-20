/**
 * Session/response mappers. Uses blockToResponse for session blocks.
 */

import type { BlockWithIncludes } from '../../blocks/utils/block-mapper.utils';
import { blockToResponse } from '../../blocks/utils/block-mapper.utils';

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

/** Create-session response: session + dto + blocks (blocks already serialized from generate-block-sequence). */
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

/** Continue-session response */
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
