/**
 * Block Domain Types
 *
 * Re-exports from generated API types. Block shape matches get-block and get-session blocks.
 * To regenerate: npm run generate:api-types
 */

import type { components } from '../generated';

type GetBlockResponseDtoOutput = components['schemas']['GetBlockResponseDto_Output'];
/** Single block (same shape as get-block response and get-session blocks). */
export type Block = GetBlockResponseDtoOutput['data'];
/** Inform block message (from block.informBlock.messages). */
export type InformBlockMessage = Extract<Block, { type: 'Inform' }>['informBlock']['messages'][number];
/** Practice block content (from block.practiceBlock). */
export type PracticeBlockContent = Extract<Block, { type: 'Practice' }>['practiceBlock'];
/** Summary block content (from block.summaryBlock). */
export type SummaryBlockContent = Extract<Block, { type: 'Summary' }>['summaryBlock'];

export type GenerateBlockSequenceResponse = components['schemas']['GenerateBlockSequenceResponseDto_Output'];
export type GenerateSummaryResponse = components['schemas']['GenerateSummaryBlockResponseDto_Output'];
export type SendMessageResponse = components['schemas']['GenerateChatResponseResponseDto_Output'];
