import { baseApi } from "./baseApi";
import type { components } from "@/types/generated";

// Type aliases for generated API types
type GenerateLearningGoalsRequest = components["schemas"]["GenerateLearningGoalsRequestDto"];
type GenerateLearningGoalsResponse = components["schemas"]["GenerateLearningGoalsResponseDto_Output"];
type GenerateEasierLearningGoalsRequest = components["schemas"]["GenerateEasierLearningGoalsRequestDto"];
type GenerateEasierLearningGoalsResponse = components["schemas"]["GenerateEasierLearningGoalsResponseDto_Output"];

/** Learning Goals API endpoints */
export const learningGoalsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    generateLearningGoals: builder.mutation<
      GenerateLearningGoalsResponse,
      GenerateLearningGoalsRequest
    >({
      query: (body) => ({
        url: "/api/learning-goals",
        method: "POST",
        body,
      }),
      invalidatesTags: ["LearningGoal"],
    }),
    generateEasierLearningGoals: builder.mutation<
      GenerateEasierLearningGoalsResponse,
      GenerateEasierLearningGoalsRequest
    >({
      query: (body) => ({
        url: "/api/learning-goals/easier",
        method: "POST",
        body,
      }),
      invalidatesTags: ["LearningGoal"],
    }),
  }),
});

export const { 
  useGenerateLearningGoalsMutation,
  useGenerateEasierLearningGoalsMutation,
} = learningGoalsApi;
