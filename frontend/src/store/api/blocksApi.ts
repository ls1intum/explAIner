import { baseApi } from "./baseApi";
import type { components, operations } from "@/types/generated";

/** Request types - imported from generated API types and renamed for clarity */
type GetBlockRequestPathParams = operations["BlocksController_getBlock"]["parameters"]["path"];
type GetBlockRequest = GetBlockRequestPathParams; // this request has an empty body{}

type SendMessageRequestPathParams = operations["BlocksController_sendMessage"]["parameters"]["path"];
type SendMessageRequestBody = components["schemas"]["GenerateChatResponseRequestDto"];
type SendMessageRequest = SendMessageRequestPathParams & SendMessageRequestBody;

type SubmitAnswerRequestPathParams = operations["BlocksController_submitAnswer"]["parameters"]["path"];
type SubmitAnswerRequestBody = components["schemas"]["SubmitAnswerRequestDto"];
type SubmitAnswerRequest = SubmitAnswerRequestPathParams & SubmitAnswerRequestBody;

/** Response types - imported from generated API types and renamed for clarity */
type GetBlockResponse = components["schemas"]["GetBlockResponseDto_Output"];
type SendMessageResponse = components["schemas"]["GenerateChatResponseResponseDto_Output"];
type SubmitAnswerResponse = components["schemas"]["SubmitAnswerResponseDto_Output"];

/** Blocks API endpoints */
export const blocksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    ////////////////////////////////////////////////////////////////////////////
    // API endpoint: GET sessions/:sessionId/blocks/:orderIndex
    ////////////////////////////////////////////////////////////////////////////
    getBlock: builder.query<
      GetBlockResponse,                                                     // API Response type
      GetBlockRequest                                                       // API Request type
    >({
      query: ({ sessionId, orderIndex }) =>                                 // API call to server
        `/api/sessions/${sessionId}/blocks/${orderIndex}`,
      providesTags: (result, error, { sessionId, orderIndex }) => [         // Provide cache tags (for mutations below)
        { type: "Block", id: `${sessionId}-${orderIndex}` },        
      ],
    }),

    ////////////////////////////////////////////////////////////////////////////
    // API endpoint: POST sessions/:sessionId/blocks/:orderIndex/messages
    ////////////////////////////////////////////////////////////////////////////
    sendMessage: builder.mutation<
      SendMessageResponse,                                                  // API Response type
      SendMessageRequest                                                    // API Request type
    >({
      query: ({ sessionId, orderIndex, message }) => ({                     // API call to server
        url: `/api/sessions/${sessionId}/blocks/${orderIndex}/messages`,
        method: "POST",
        body: { message },
      }),
      invalidatesTags: (result, error, { sessionId, orderIndex }) => [      // Invalidate cache tags (so inform block is refetched with new messages)
        { type: "Block", id: `${sessionId}-${orderIndex}` },
      ],
    }),


    ////////////////////////////////////////////////////////////////////////////
    // API endpoint: PUT sessions/:sessionId/blocks/:orderIndex/student-answer
    ////////////////////////////////////////////////////////////////////////////
    submitAnswer: builder.mutation<
      SubmitAnswerResponse,                                                 // API Response type
      SubmitAnswerRequest                                                   // API Request type
    >({
      query: ({ sessionId, orderIndex, studentAnswerOptionIndices }) => ({  // API call to server
        url: `/api/sessions/${sessionId}/blocks/${orderIndex}/student-answer`,
        method: "PUT",
        body: { studentAnswerOptionIndices },
      }),
      // no cache tags need to be invalidated
    }),
  }),
});

/** Blocks API hooks to use in pages/components */
export const {
  useGetBlockQuery,
  useSendMessageMutation,
  useSubmitAnswerMutation,
} = blocksApi;