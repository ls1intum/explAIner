import { baseApi } from "./baseApi";
import type { components, operations } from "@/types/generated";

/** Request types - imported from generated API types and renamed for clarity (request type = request path params AND/OR request body) */
type GetBlockRequestPathParams = operations["BlocksController_getBlock"]["parameters"]["path"];
export type GetBlockRequest = GetBlockRequestPathParams;

type GenerateChatResponseRequestPathParams = operations["BlocksController_sendMessage"]["parameters"]["path"];
type GenerateChatResponseRequestBody = components["schemas"]["GenerateChatResponseRequestDto"];
type GenerateChatResponseRequest = GenerateChatResponseRequestPathParams & GenerateChatResponseRequestBody;

type SubmitAnswerRequestPathParams = operations["BlocksController_submitAnswer"]["parameters"]["path"];
type SubmitAnswerRequestBody = components["schemas"]["SubmitAnswerRequestDto"];
type SubmitAnswerRequest = SubmitAnswerRequestPathParams & SubmitAnswerRequestBody;

type GenerateBlockSequenceRequestPathParams = operations["BlocksController_generateSequence"]["parameters"]["path"];
type GenerateBlockSequenceRequest = GenerateBlockSequenceRequestPathParams;

type GenerateSummaryBlockRequestPathParams = operations["BlocksController_generateSummary"]["parameters"]["path"];
type GenerateSummaryBlockRequest = GenerateSummaryBlockRequestPathParams;

/** Response types - imported from generated API types and renamed for clarity */
export type GetBlockResponse = components["schemas"]["GetBlockResponseDto_Output"];
type GenerateChatResponseResponse = components["schemas"]["GenerateChatResponseResponseDto_Output"];
type SubmitAnswerResponse = components["schemas"]["SubmitAnswerResponseDto_Output"];
type GenerateBlockSequenceResponse = components["schemas"]["GenerateBlockSequenceResponseDto_Output"];
type GenerateSummaryBlockResponse = components["schemas"]["GenerateSummaryBlockResponseDto_Output"];

/** Blocks API endpoints */
export const blocksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    ////////////////////////////////////////////////////////////////////////////
    // API endpoint: GET sessions/:sessionId/blocks/:orderIndex
    ////////////////////////////////////////////////////////////////////////////
    getBlock: builder.query<
      GetBlockResponse,                                                     // API Response type
      GetBlockRequest                                                       // API Request type
    >({
      query: ({ sessionId, orderIndex }) =>                                 // API call to server
        `/api/sessions/${sessionId}/blocks/${orderIndex}`,
      providesTags: (result, error, { sessionId, orderIndex }) => [         // Provide cache tags (for mutations below)
        { type: "Block", id: `${sessionId}-${orderIndex}` },        
      ],
    }),

    ////////////////////////////////////////////////////////////////////////////
    // API endpoint: POST sessions/:sessionId/blocks/:orderIndex/messages
    ////////////////////////////////////////////////////////////////////////////
    generateChatResponse: builder.mutation<
      GenerateChatResponseResponse,                                                  // API Response type
      GenerateChatResponseRequest                                                    // API Request type
    >({
      query: ({ sessionId, orderIndex, message }) => ({                     // API call to server
        url: `/api/sessions/${sessionId}/blocks/${orderIndex}/messages`,
        method: "POST",
        body: { message },
      }),
      invalidatesTags: (result, error, { sessionId, orderIndex }) => [      // Invalidate cache tags (so inform block is refetched with new messages)
        { type: "Block", id: `${sessionId}-${orderIndex}` },
      ],
    }),


    ////////////////////////////////////////////////////////////////////////////
    // API endpoint: PUT sessions/:sessionId/blocks/:orderIndex/student-answer
    ////////////////////////////////////////////////////////////////////////////
    submitAnswer: builder.mutation<
      SubmitAnswerResponse,                                                 // API Response type
      SubmitAnswerRequest                                                   // API Request type
    >({
      query: ({ sessionId, orderIndex, studentAnswerOptionIndices }) => ({  // API call to server
        url: `/api/sessions/${sessionId}/blocks/${orderIndex}/student-answer`,
        method: "PUT",
        body: { studentAnswerOptionIndices },
      }),
      // no cache tags need to be invalidated
    }),

    ////////////////////////////////////////////////////////////////////////////
    // API endpoint: POST /api/sessions/:sessionId/blocks/sequence
    ////////////////////////////////////////////////////////////////////////////
    generateBlockSequence: builder.mutation<
      GenerateBlockSequenceResponse,                                        // API Response type
      GenerateBlockSequenceRequest                                          // API Request type
    >({
      query: ({ sessionId }) => ({                                          // API call to server
        url: `/api/sessions/${sessionId}/blocks/sequence`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["Session", "Block"],                                 // Invalidate cache so session and blocks are refetched
    }),

    ////////////////////////////////////////////////////////////////////////////
    // API endpoint: POST /api/sessions/:sessionId/blocks/summary
    ////////////////////////////////////////////////////////////////////////////
    generateSummaryBlock: builder.mutation<
      GenerateSummaryBlockResponse,                                         // API Response type
      GenerateSummaryBlockRequest                                           // API Request type
    >({
      query: ({ sessionId }) => ({                                          // API call to server
        url: `/api/sessions/${sessionId}/blocks/summary`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["Session", "Block"],                                // Invalidate cache so session and blocks are refetched
    }),
  }),
});

/** Blocks API hooks to use in pages/components */
export const {
  useGetBlockQuery,
  useGenerateChatResponseMutation,
  useSubmitAnswerMutation,
  useGenerateBlockSequenceMutation,
  useGenerateSummaryBlockMutation,
} = blocksApi;