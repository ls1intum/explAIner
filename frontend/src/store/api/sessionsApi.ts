import { baseApi } from "./baseApi";
import type { components, operations } from "@/types/generated";

/** Request types - imported from generated API types and renamed for clarity (request type = request path params AND/OR request body) */
type CreateSessionRequestBody = components["schemas"]["CreateSessionRequestDto"];
type CreateSessionRequest = CreateSessionRequestBody;

type GetSessionRequestPathParams = operations["SessionsController_findOne"]["parameters"]["path"];
type GetSessionRequest = GetSessionRequestPathParams;

type ContinueSessionRequestPathParams = operations["SessionsController_continue"]["parameters"]["path"];
type ContinueSessionRequest = ContinueSessionRequestPathParams;

type SubmitFeedbackRequestPathParams = operations["SessionsController_submitFeedback"]["parameters"]["path"];
type SubmitFeedbackRequestBody = components["schemas"]["SubmitFeedbackRequestDto"];
type SubmitFeedbackRequest = SubmitFeedbackRequestPathParams & SubmitFeedbackRequestBody;

type UpdateCurrentBlockIndexRequestPathParams = operations["SessionsController_updateCurrentBlockIndex"]["parameters"]["path"];
type UpdateCurrentBlockIndexRequestBody = components["schemas"]["UpdateCurrentBlockIndexRequestDto"];
type UpdateCurrentBlockIndexRequest = UpdateCurrentBlockIndexRequestPathParams & UpdateCurrentBlockIndexRequestBody;

type DeleteSessionRequestPathParams = operations["SessionsController_remove"]["parameters"]["path"];
type DeleteSessionRequest = DeleteSessionRequestPathParams;

/** Response types - imported from generated API types and renamed for clarity */
type CreateSessionResponse = components["schemas"]["CreateSessionResponseDto_Output"];
type GetSessionResponse = components["schemas"]["GetSessionResponseDto_Output"];
type ContinueSessionResponse = components["schemas"]["ContinueSessionResponseDto_Output"];
type SubmitFeedbackResponse = components["schemas"]["SubmitFeedbackResponseDto_Output"];
type UpdateCurrentBlockIndexResponse = components["schemas"]["UpdateCurrentBlockIndexResponseDto_Output"];
type DeleteSessionResponse = components["schemas"]["DeleteSessionResponseDto_Output"];

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
      providesTags: ["Session"],                                            // Provide cache tags (for mutations below)
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
      invalidatesTags: ["Session"],                                         // Invalidate cache so session is refetched
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
      invalidatesTags: ["Session"],                                         // Invalidate cache so session is refetched
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
