import { baseApi } from "./baseApi";

// POST /api/learning-goals

export const learningGoalsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createLearningGoal: builder.mutation({
      query: (body) => ({
        url: "/api/learning-goals",
        method: "POST",
        body,
      }),
      invalidatesTags: ["LearningGoal"],
    }),
  }),
});

export const { useCreateLearningGoalMutation } = learningGoalsApi;
