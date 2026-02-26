import { baseApi } from "./baseApi";
import type {
  GenerateLearningGoalsRequest,
  GenerateLearningGoalsResponse,
  GenerateEasierLearningGoalsRequest,
  GenerateEasierLearningGoalsResponse,
} from "@/types/domain/learning-goals.types";

/** Learning Goals API endpoints */
export const learningGoalsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    ////////////////////////////////////////////////////////////////////////////
    // API endpoint: POST /api/learning-goals
    ////////////////////////////////////////////////////////////////////////////
    generateLearningGoals: builder.mutation<
      GenerateLearningGoalsResponse,                                        // API Response type
      GenerateLearningGoalsRequest                                          // API Request type
    >({
      query: (body) => ({                                                   // API call to server
        url: "/api/learning-goals",
        method: "POST",
        body,
      }),
      invalidatesTags: ["LearningGoal"],                                    // Invalidate cache so learning goals list is refetched
    }),

    ////////////////////////////////////////////////////////////////////////////
    // API endpoint: POST /api/learning-goals/easier
    ////////////////////////////////////////////////////////////////////////////
    generateEasierLearningGoals: builder.mutation<
      GenerateEasierLearningGoalsResponse,                                   // API Response type
      GenerateEasierLearningGoalsRequest                                     // API Request type
    >({
      query: (body) => ({                                                    // API call to server
        url: "/api/learning-goals/easier",
        method: "POST",
        body,
      }),
      invalidatesTags: ["LearningGoal"],                                     // Invalidate cache so learning goals list is refetched
    }),
  }),
});

/** Learning Goals API hooks to use in pages/components */
export const {
  useGenerateLearningGoalsMutation,
  useGenerateEasierLearningGoalsMutation,
} = learningGoalsApi;
