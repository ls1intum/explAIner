/**
 * Block Domain Types
 *
 * Re-exports from generated API types. Block shape matches get-block and get-session blocks.
 * To regenerate: npm run generate:api-types
 */

import type { components, operations } from '../generated';

type GetBlockResponseDtoOutput = components['schemas']['GetBlockResponseDto_Output'];
/** Single block (same shape as get-block response and get-session blocks). */
export type Block = GetBlockResponseDtoOutput['data'];
/** Inform block message (from block.informBlock.messages). */
export type InformBlockMessage = Extract<Block, { type: 'Inform' }>['informBlock']['messages'][number];
/** Practice block content (from block.practiceBlock). */
export type PracticeBlockContent = Extract<Block, { type: 'Practice' }>['practiceBlock'];
/** Summary block content (from block.summaryBlock). */
export type SummaryBlockContent = Extract<Block, { type: 'Summary' }>['summaryBlock'];

// --- Blocks API request/response types ---
export type GetBlockRequest = operations['BlocksController_getBlock']['parameters']['path'];
export type GetBlockResponse = components['schemas']['GetBlockResponseDto_Output'];

type GenerateChatResponsePath = operations['BlocksController_sendMessage']['parameters']['path'];
type GenerateChatResponseBody = components['schemas']['GenerateChatResponseRequestDto'];
export type GenerateChatResponseRequest = GenerateChatResponsePath & GenerateChatResponseBody;
export type GenerateChatResponseResponse = components['schemas']['GenerateChatResponseResponseDto_Output'];

type SubmitAnswerPath = operations['BlocksController_submitAnswer']['parameters']['path'];
type SubmitAnswerBody = components['schemas']['SubmitAnswerRequestDto'];
export type SubmitAnswerRequest = SubmitAnswerPath & SubmitAnswerBody;
export type SubmitAnswerResponse = components['schemas']['SubmitAnswerResponseDto_Output'];

export type GenerateBlockSequenceRequest = operations['BlocksController_generateSequence']['parameters']['path'];
export type GenerateBlockSequenceResponse = components['schemas']['GenerateBlockSequenceResponseDto_Output'];

export type GenerateSummaryBlockRequest = operations['BlocksController_generateSummary']['parameters']['path'];
export type GenerateSummaryBlockResponse = components['schemas']['GenerateSummaryBlockResponseDto_Output'];
