import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/** Base API config (baseURL, cache tags) */
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  }),
  tagTypes: ["Session", "Block", "LearningGoal"],
  endpoints: () => ({}),
});
