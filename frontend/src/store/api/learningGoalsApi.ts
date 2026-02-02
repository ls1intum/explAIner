import { baseApi } from "./baseApi";
import type {
  LearningGoal,
  GenerateLearningGoalsRequest,
} from "@/types/learning-goals.types";

// Learning Goals API endpoints

export const learningGoalsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    generateLearningGoals: builder.mutation<
      LearningGoal[],
      GenerateLearningGoalsRequest
    >({
      query: (body) => ({
        url: "/api/learning-goals",
        method: "POST",
        body,
      }),
      invalidatesTags: ["LearningGoal"],
    }),
  }),
});

export const { useGenerateLearningGoalsMutation } = learningGoalsApi;
