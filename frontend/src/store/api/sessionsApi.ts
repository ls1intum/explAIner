import { baseApi } from "./baseApi";

// Session CRUD + submitFeedback

export const sessionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSession: builder.mutation({
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
    submitFeedback: builder.mutation({
      query: ({ sessionId, ...body }) => ({
        url: `/api/sessions/${sessionId}/feedback`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Session"],
    }),
  }),
});

export const {
  useCreateSessionMutation,
  useGetSessionQuery,
  useSubmitFeedbackMutation,
} = sessionsApi;
