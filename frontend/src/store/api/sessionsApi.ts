import { baseApi } from "./baseApi";
import type {
  CreateSessionRequest,
  CreateSessionResponse,
  Block,
  ContinueSessionResponse,
} from "@/types/session.types";

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
    getSession: builder.query({
      query: (sessionId: string) => `/api/sessions/${sessionId}`,
      providesTags: ["Session"],
    }),
    // Fetch block by orderIndex with caching support
    getBlockByOrderIndex: builder.query<
      Block,
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
      { informBlock: Block; practiceBlocks: Block[] },
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
      {
        block: Block;
        sessionInfo: {
          learningGoal: string;
          bloomsLevel: string;
          totalBlocks: number;
          sessionDuration: number;
          allPracticeCorrect: boolean;
        };
      },
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
      { success: boolean; rating: number },
      { sessionId: string; rating: number }
    >({
      query: ({ sessionId, rating }) => ({
        url: `/api/sessions/${sessionId}/submit-feedback`,
        method: "POST",
        body: { rating },
      }),
      invalidatesTags: ["Session"],
    }),
    // Update current block index
    updateCurrentBlockIndex: builder.mutation<
      { success: boolean; currentBlockIndex: number },
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
      { success: boolean },
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
