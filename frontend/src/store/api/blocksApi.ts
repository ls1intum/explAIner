import { baseApi } from "./baseApi";
import type { components } from "@/types/generated";

// Type aliases for generated API types
type GetBlockResponse = components["schemas"]["GetBlockResponseDto_Output"];
type SendMessageResponse = components["schemas"]["GenerateChatResponseResponseDto_Output"];

// getBlock (aligned with backend GET /sessions/:sessionId/blocks/:orderIndex), submitAnswer, sendMessage

export const blocksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlock: builder.query<
      GetBlockResponse,
      { sessionId: string; orderIndex: number }
    >({
      query: ({ sessionId, orderIndex }) =>
        `/api/sessions/${sessionId}/blocks/${orderIndex}`,
      providesTags: (result, error, { sessionId, orderIndex }) => [
        { type: "Block", id: `${sessionId}-${orderIndex}` },
      ],
    }),
    sendMessage: builder.mutation<
      SendMessageResponse,
      { sessionId: string; orderIndex: number; message: string }
    >({
      query: ({ sessionId, orderIndex, message }) => ({
        url: `/api/sessions/${sessionId}/blocks/${orderIndex}/messages`,
        method: "POST",
        body: { message },
      }),
      // Invalidate the cache for this specific block so it refetches with new messages
      invalidatesTags: (result, error, { sessionId, orderIndex }) => [
        { type: "Block", id: `${sessionId}-${orderIndex}` },
      ],
    }),
    submitAnswer: builder.mutation<
      void,
      {
        sessionId: string;
        orderIndex: number;
        studentAnswerOptionIndices: number[];
      }
    >({
      query: ({ sessionId, orderIndex, studentAnswerOptionIndices }) => ({
        url: `/api/sessions/${sessionId}/blocks/${orderIndex}/student-answer`,
        method: "PUT",
        body: { studentAnswerOptionIndices },
      }),
    }),
  }),
});

export const {
  useGetBlockQuery,
  useSendMessageMutation,
  useSubmitAnswerMutation,
} = blocksApi;
