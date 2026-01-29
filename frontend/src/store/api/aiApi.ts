import { baseApi } from "./baseApi";

// sendMessage (follow-up questions)

export const aiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: ({ blockId, message }) => ({
        url: `/api/ai/chat`,
        method: "POST",
        body: { blockId, message },
      }),
    }),
  }),
});

export const { useSendMessageMutation } = aiApi;
