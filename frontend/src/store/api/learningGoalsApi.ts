import { baseApi } from "./baseApi";
import type { components } from "@/types/generated";

/** Request types - imported from generated API types and renamed for clarity (request type = request path params AND/OR request body) */
type GenerateLearningGoalsRequestBody = components["schemas"]["GenerateLearningGoalsRequestDto"];
type GenerateLearningGoalsRequest = GenerateLearningGoalsRequestBody; // this request has no path params

type GenerateEasierLearningGoalsRequestBody = components["schemas"]["GenerateEasierLearningGoalsRequestDto"];
type GenerateEasierLearningGoalsRequest = GenerateEasierLearningGoalsRequestBody; // this request has no path params

/** Response types - imported from generated API types and renamed for clarity */
type GenerateLearningGoalsResponse = components["schemas"]["GenerateLearningGoalsResponseDto_Output"];
type GenerateEasierLearningGoalsResponse = components["schemas"]["GenerateEasierLearningGoalsResponseDto_Output"];

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
