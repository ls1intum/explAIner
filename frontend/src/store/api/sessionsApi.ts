import { baseApi } from "./baseApi";
import type { components } from "@/types/generated";

// Type aliases for generated API types
type CreateSessionRequest = components["schemas"]["CreateSessionRequestDto"];
type CreateSessionResponse = components["schemas"]["CreateSessionResponseDto"];
type GetSessionResponse = components["schemas"]["GetSessionResponseDto"];
type GetBlockResponse = components["schemas"]["GetBlockResponseDto"];
type ContinueSessionResponse = components["schemas"]["ContinueSessionResponseDto_Output"];
type GenerateBlockSequenceResponse = components["schemas"]["GenerateBlockSequenceResponseDto"];
type GenerateSummaryResponse = components["schemas"]["GenerateSummaryBlockResponseDto"];
type SubmitFeedbackResponse = components["schemas"]["SubmitFeedbackResponseDto_Output"];
type UpdateCurrentBlockIndexResponse = components["schemas"]["UpdateCurrentBlockIndexResponseDto_Output"];
type DeleteSessionResponse = components["schemas"]["DeleteSessionResponseDto_Output"];

// Session CRUD + submitFeedback + block navigation

export const sessionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSession: builder.mutation<
      CreateSessionResponse,
      CreateSessionRequest
    >({
      query: (body) => ({
        url: "/api/sessions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Session"],
    }),
    getSession: builder.query<GetSessionResponse, string>({
      query: (sessionId: string) => `/api/sessions/${sessionId}`,
      providesTags: ["Session"],
    }),
    // Fetch block by orderIndex with caching support
    getBlockByOrderIndex: builder.query<
      GetBlockResponse,
      { sessionId: string; orderIndex: number }
    >({
      query: ({ sessionId, orderIndex }) =>
        `/api/sessions/${sessionId}/blocks/${orderIndex}`,
      providesTags: (result, error, { sessionId, orderIndex }) => [
        { type: "Block", id: `${sessionId}-${orderIndex}` },
      ],
    }),
    // Continue session - determines next action
    continueSession: builder.mutation<
      ContinueSessionResponse,
      { sessionId: string }
    >({
      query: ({ sessionId }) => ({
        url: `/api/sessions/${sessionId}/continue`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["Session"],
    }),
    // Generate next block sequence (mode auto-detected by backend)
    generateNextSequence: builder.mutation<
      GenerateBlockSequenceResponse,
      { sessionId: string }
    >({
      query: ({ sessionId }) => ({
        url: `/api/sessions/${sessionId}/blocks/sequence`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["Session", "Block"],
    }),
    // Generate summary block
    generateSummary: builder.mutation<
      GenerateSummaryResponse,
      { sessionId: string }
    >({
      query: ({ sessionId }) => ({
        url: `/api/sessions/${sessionId}/blocks/summary`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["Session", "Block"],
    }),
    submitFeedback: builder.mutation<
      SubmitFeedbackResponse,
      { sessionId: string; rating: number }
    >({
      query: ({ sessionId, rating }) => ({
        url: `/api/sessions/${sessionId}/feedback`,
        method: "PUT",
        body: { rating },
      }),
      invalidatesTags: ["Session"],
    }),
    // Update current block index
    updateCurrentBlockIndex: builder.mutation<
      UpdateCurrentBlockIndexResponse,
      { sessionId: string; currentBlockIndex: number }
    >({
      query: ({ sessionId, currentBlockIndex }) => ({
        url: `/api/sessions/${sessionId}/current-block-index`,
        method: "PATCH",
        body: { currentBlockIndex },
      }),
      invalidatesTags: ["Session"],
    }),
    // Delete session and all related data
    deleteSession: builder.mutation<
      DeleteSessionResponse,
      { sessionId: string }
    >({
      query: ({ sessionId }) => ({
        url: `/api/sessions/${sessionId}`,
        method: "DELETE",
      }),
      // No invalidatesTags needed - we're navigating away and clearing state
    }),
  }),
});

export const {
  useCreateSessionMutation,
  useGetSessionQuery,
  useGetBlockByOrderIndexQuery,
  useContinueSessionMutation,
  useGenerateNextSequenceMutation,
  useGenerateSummaryMutation,
  useSubmitFeedbackMutation,
  useUpdateCurrentBlockIndexMutation,
  useDeleteSessionMutation,
} = sessionsApi;
