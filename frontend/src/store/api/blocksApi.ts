import { baseApi } from "./baseApi";

// getBlock, submitAnswer

export const blocksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlock: builder.query({
      query: (blockId: string) => `/api/blocks/${blockId}`,
      providesTags: ["Block"],
    }),
    submitAnswer: builder.mutation({
      query: ({ blockId, ...body }) => ({
        url: `/api/blocks/${blockId}/submit`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Block"],
    }),
  }),
});

export const { useGetBlockQuery, useSubmitAnswerMutation } = blocksApi;
