import { baseApi } from "./baseApi";
import type { components } from "@/types/generated";

// Type aliases for generated API types
type GetBlockResponse = components["schemas"]["GetBlockResponseDto_Output"];
type SendMessageResponse = components["schemas"]["GenerateChatResponseResponseDto_Output"];
type SubmitAnswerResponse = components["schemas"]["SubmitAnswerResponseDto_Output"];

/** Blocks API endpoints */
export const blocksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    ////////////////////////////////////////////////////////////////////////////
    // API endpoint: GET sessions/:sessionId/blocks/:orderIndex
    ////////////////////////////////////////////////////////////////////////////
    getBlock: builder.query<
      GetBlockResponse,                                               // API Response
      { sessionId: string; orderIndex: number }                       // API Request (only path parameters, empty body)
    >({
      query: ({ sessionId, orderIndex }) =>                           // API call to server
        `/api/sessions/${sessionId}/blocks/${orderIndex}`,
      providesTags: (result, error, { sessionId, orderIndex }) => [   // Provide cache tags (for mutations below)
        { type: "Block", id: `${sessionId}-${orderIndex}` },        
      ],
    }),


    ////////////////////////////////////////////////////////////////////////////
    // API endpoint: POST sessions/:sessionId/blocks/:orderIndex/messages
    ////////////////////////////////////////////////////////////////////////////
    sendMessage: builder.mutation<
      SendMessageResponse,                                            // API Response
      { sessionId: string; orderIndex: number; message: string }      // API Request
    >({
      // API call to server (POST request)
      query: ({ sessionId, orderIndex, message }) => ({
        url: `/api/sessions/${sessionId}/blocks/${orderIndex}/messages`,
        method: "POST",
        body: { message },
      }),
      // Invalidate cache tags (so inform block is refetched with new messages)
      invalidatesTags: (result, error, { sessionId, orderIndex }) => [
        { type: "Block", id: `${sessionId}-${orderIndex}` },
      ],
    }),

    /** API Endpoint: submitAnswer */
    submitAnswer: builder.mutation<
      // API Response
      SubmitAnswerResponse,
      // API Request
      {
        sessionId: string;
        orderIndex: number;
        studentAnswerOptionIndices: number[];
      }
    >({
      // API call to server
      query: ({ sessionId, orderIndex, studentAnswerOptionIndices }) => ({
        url: `/api/sessions/${sessionId}/blocks/${orderIndex}/student-answer`,
        method: "PUT",
        body: { studentAnswerOptionIndices },
      }),
    }),
  }),
});


/** Blocks API hooks to use in pages/components */
export const {
  useGetBlockQuery,
  useSendMessageMutation,
  useSubmitAnswerMutation,
} = blocksApi;
