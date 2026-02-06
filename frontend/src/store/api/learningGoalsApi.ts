import { baseApi } from "./baseApi";
import type {
  GenerateLearningGoalsRequest,
  GenerateLearningGoalsResponse,
  GenerateEasierLearningGoalsRequest,
  GenerateEasierLearningGoalsResponse,
} from "@/types/learning-goals.types";

// Learning Goals API endpoints

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
