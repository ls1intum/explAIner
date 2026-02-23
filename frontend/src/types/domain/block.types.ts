/**
 * Block Domain Types
 *
 * Re-exports from generated API types. Block shape matches get-session blocks (Prisma-shaped: informBlock | practiceBlock | summaryBlock).
 * To regenerate: npm run generate:api-types
 */

import type { components } from '../generated';

type GetSessionResponseDto = components['schemas']['GetSessionResponseDto'];
/** Single block (same shape as get-block and get-session blocks). */
export type Block = GetSessionResponseDto['blocks'][number];
/** Inform block message (from block.informBlock.messages). */
export type InformBlockMessage = Extract<Block, { type: 'Inform' }>['informBlock']['messages'][number];
/** Practice block content (from block.practiceBlock). */
export type PracticeBlockContent = Extract<Block, { type: 'Practice' }>['practiceBlock'];
/** Summary block content (from block.summaryBlock). */
export type SummaryBlockContent = Extract<Block, { type: 'Summary' }>['summaryBlock'];

export type GenerateBlockSequenceResponse = components['schemas']['GenerateBlockSequenceResponseDto'];
export type GenerateSummaryResponse = components['schemas']['GenerateSummaryBlockResponseDto'];
export type SendMessageResponse = components['schemas']['GenerateChatResponseResponseDto_Output'];
