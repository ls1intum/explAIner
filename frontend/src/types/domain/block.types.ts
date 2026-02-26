/**
 * Block Domain Types
 *
 * Generated from OpenAPI specification, re-exported here for client-side usage with cleaner imports
 * For further details, see ../README.md (client/src/types/README.md)
 */

import type { components, operations } from '../generated/api.types';

////////////////////////////////////////////////////////////////////////////
// Block API request types
 // request type = request path params AND/OR request body {}
////////////////////////////////////////////////////////////////////////////

type GetBlockRequestPathParams = operations['BlocksController_getBlock']['parameters']['path'];
export type GetBlockRequest = GetBlockRequestPathParams;

type GenerateChatResponseRequestPathParams = operations['BlocksController_sendMessage']['parameters']['path'];
type GenerateChatResponseRequestBody = components['schemas']['GenerateChatResponseRequestDto'];
export type GenerateChatResponseRequest = GenerateChatResponseRequestPathParams & GenerateChatResponseRequestBody;

type SubmitAnswerRequestPathParams = operations['BlocksController_submitAnswer']['parameters']['path'];
type SubmitAnswerRequestBody = components['schemas']['SubmitAnswerRequestDto'];
export type SubmitAnswerRequest = SubmitAnswerRequestPathParams & SubmitAnswerRequestBody;

type GenerateBlockSequenceRequestPathParams = operations['BlocksController_generateSequence']['parameters']['path'];
export type GenerateBlockSequenceRequest = GenerateBlockSequenceRequestPathParams;

type GenerateSummaryBlockRequestPathParams = operations['BlocksController_generateSummary']['parameters']['path'];
export type GenerateSummaryBlockRequest = GenerateSummaryBlockRequestPathParams;

////////////////////////////////////////////////////////////////////////////
// Block API response types
////////////////////////////////////////////////////////////////////////////

export type GetBlockResponse = components['schemas']['GetBlockResponseDto_Output'];

export type GenerateChatResponseResponse = components['schemas']['GenerateChatResponseResponseDto_Output'];

export type SubmitAnswerResponse = components['schemas']['SubmitAnswerResponseDto_Output'];

export type GenerateBlockSequenceResponse = components['schemas']['GenerateBlockSequenceResponseDto_Output'];

export type GenerateSummaryBlockResponse = components['schemas']['GenerateSummaryBlockResponseDto_Output'];

////////////////////////////////////////////////////////////////////////////
// Additional Block (content) types
////////////////////////////////////////////////////////////////////////////

export type Block = GetBlockResponse['data'];
export type InformBlockMessage = Extract<Block, { type: 'Inform' }>['informBlock']['messages'][number];
export type PracticeBlockContent = Extract<Block, { type: 'Practice' }>['practiceBlock'];
export type SummaryBlockContent = Extract<Block, { type: 'Summary' }>['summaryBlock'];