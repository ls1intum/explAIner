import { baseApi } from "./baseApi";
import type { InformBlockMessage } from "@/types/session.types";

// getBlock, submitAnswer, sendMessage

export const blocksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlock: builder.query({
      query: (blockId: string) => `/api/blocks/${blockId}`,
      providesTags: ["Block"],
    }),
    sendMessage: builder.mutation<
      { response: string },
      { sessionId: string; orderIndex: number; message: string }
    >({
      query: ({ sessionId, orderIndex, message }) => ({
        url: `/api/sessions/${sessionId}/blocks/${orderIndex}/send-message`,
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
        student_answer_option_indices: number[];
      }
    >({
      query: ({ sessionId, orderIndex, student_answer_option_indices }) => ({
        url: `/api/sessions/${sessionId}/blocks/${orderIndex}/submit-answer`,
        method: "PATCH",
        body: { student_answer_option_indices },
      }),
    }),
  }),
});

export const {
  useGetBlockQuery,
  useSendMessageMutation,
  useSubmitAnswerMutation,
} = blocksApi;
