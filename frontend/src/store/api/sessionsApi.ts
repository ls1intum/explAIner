import { baseApi } from "./baseApi";
import type {
  CreateSessionRequest,
  CreateSessionResponse,
  GetSessionRequest,
  GetSessionResponse,
  ContinueSessionRequest,
  ContinueSessionResponse,
  SubmitFeedbackRequest,
  SubmitFeedbackResponse,
  UpdateCurrentBlockIndexRequest,
  UpdateCurrentBlockIndexResponse,
  DeleteSessionRequest,
  DeleteSessionResponse,
} from "@/types/domain";

/** Sessions API endpoints */
export const sessionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    ////////////////////////////////////////////////////////////////////////////
    // API endpoint: POST /api/sessions
    ////////////////////////////////////////////////////////////////////////////
    createSession: builder.mutation<
      CreateSessionResponse,                                                // API Response type
      CreateSessionRequest                                                  // API Request type
    >({
      query: (body) => ({                                                   // API call to server
        url: "/api/sessions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Session"],                                         // Invalidate cache so sessions list is refetched
    }),

    ////////////////////////////////////////////////////////////////////////////
    // API endpoint: GET /api/sessions/:sessionId
    ////////////////////////////////////////////////////////////////////////////
    getSession: builder.query<
      GetSessionResponse,                                                   // API Response type
      GetSessionRequest                                                     // API Request type
    >({
      query: ({ sessionId }) =>                                             // API call to server
        `/api/sessions/${sessionId}`,
      providesTags: (result, error, { sessionId }) => [{ type: "Session", id: sessionId }],
    }),

    ////////////////////////////////////////////////////////////////////////////
    // API endpoint: POST /api/sessions/:sessionId/continue
    ////////////////////////////////////////////////////////////////////////////
    continueSession: builder.mutation<
      ContinueSessionResponse,                                              // API Response type
      ContinueSessionRequest                                                // API Request type
    >({
      query: ({ sessionId }) => ({                                          // API call to server
        url: `/api/sessions/${sessionId}/continue`,
        method: "POST",
        body: {},
      }),
      // No invalidatesTags – on "navigate" we only set currentBlockIndex and fetch that block via getBlock
    }),

    ////////////////////////////////////////////////////////////////////////////
    // API endpoint: PUT /api/sessions/:sessionId/feedback
    ////////////////////////////////////////////////////////////////////////////
    submitFeedback: builder.mutation<
      SubmitFeedbackResponse,                                               // API Response type
      SubmitFeedbackRequest                                                 // API Request type
    >({
      query: ({ sessionId, rating }) => ({                                  // API call to server
        url: `/api/sessions/${sessionId}/feedback`,
        method: "PUT",
        body: { rating },
      }),
      invalidatesTags: ["Session"],                                         // Invalidate cache so session is refetched
    }),

    ////////////////////////////////////////////////////////////////////////////
    // API endpoint: PATCH /api/sessions/:sessionId/current-block-index
    ////////////////////////////////////////////////////////////////////////////
    updateCurrentBlockIndex: builder.mutation<
      UpdateCurrentBlockIndexResponse,                                      // API Response type
      UpdateCurrentBlockIndexRequest                                        // API Request type
    >({
      query: ({ sessionId, currentBlockIndex }) => ({                       // API call to server
        url: `/api/sessions/${sessionId}/current-block-index`,
        method: "PATCH",
        body: { currentBlockIndex },
      }),
      // No invalidatesTags – navbar uses highestAlreadyViewedBlockIndex in slice so chips stay visible when navigating back
    }),

    ////////////////////////////////////////////////////////////////////////////
    // API endpoint: DELETE /api/sessions/:sessionId
    ////////////////////////////////////////////////////////////////////////////
    deleteSession: builder.mutation<
      DeleteSessionResponse,                                                // API Response type
      DeleteSessionRequest                                                  // API Request type
    >({
      query: ({ sessionId }) => ({                                          // API call to server
        url: `/api/sessions/${sessionId}`,
        method: "DELETE",
      }),
      // No invalidatesTags – caller navigates away and clears state
    }),
  }),
});

/** Sessions API hooks to use in pages/components */
export const {
  useCreateSessionMutation,
  useGetSessionQuery,
  useContinueSessionMutation,
  useSubmitFeedbackMutation,
  useUpdateCurrentBlockIndexMutation,
  useDeleteSessionMutation,
} = sessionsApi;
