import { baseApi } from "./baseApi";
import type {
  GetBlockRequest,
  GetBlockResponse,
  GenerateChatResponseRequest,
  GenerateChatResponseResponse,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
  GenerateBlockSequenceRequest,
  GenerateBlockSequenceResponse,
  GenerateSummaryBlockRequest,
  GenerateSummaryBlockResponse,
} from "@/types/domain";

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
      GenerateChatResponseResponse,                                         // API Response type
      GenerateChatResponseRequest                                           // API Request type
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
      invalidatesTags: (result, error, { sessionId, orderIndex }) => [{ type: "Block", id: `${sessionId}-${orderIndex}` }],
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
      invalidatesTags: (result, error, { sessionId }) => [{ type: "Session", id: sessionId }],
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
      invalidatesTags: (result, error, { sessionId }) => [{ type: "Session", id: sessionId }],
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