import { baseApi } from "./baseApi";
import type {
  ContinueSessionResponse,
} from "@/types/domain/session.types";
import type {
  GenerateBlockSequenceResponse,
} from "@/types/domain/block.types";

interface CreateSigilSessionRequest {
  group: "explainer" | "chat" | "text";
  section: "elements";
  lang?: "de" | "en";
  /** SoSci Survey case number (?case=); an existing session of this case is resumed. */
  sosciCase?: string;
  /** Survey pretest (?test=1): the session is stored as test data. */
  isTestRun?: boolean;
}

interface CreateSigilSessionResponse {
  sessionId: string;
  group: string;
  section: string;
  lang: string;
  hasPractice: boolean;
  hasChat: boolean;
  isTestRun: boolean;
  /** True when an existing session of the same SoSci case was returned. */
  resumed: boolean;
  informBlock: {
    id: string;
    orderIndex: number;
    type: string;
  };
}

interface ContinueSigilSessionRequest {
  sessionId: string;
}

interface GenerateSigilBlockSequenceRequest {
  sessionId: string;
  lang?: "de" | "en";
}

export const sigilApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createSigilSession: builder.mutation<
      CreateSigilSessionResponse,
      CreateSigilSessionRequest
    >({
      query: (body) => ({
        url: "/api/sigil/sessions",
        method: "POST",
        body,
      }),
    }),

    continueSigilSession: builder.mutation<
      ContinueSessionResponse,
      ContinueSigilSessionRequest
    >({
      query: ({ sessionId }) => ({
        url: `/api/sigil/sessions/${sessionId}/continue`,
        method: "POST",
        body: {},
      }),
    }),

    generateSigilBlockSequence: builder.mutation<
      GenerateBlockSequenceResponse,
      GenerateSigilBlockSequenceRequest
    >({
      query: ({ sessionId, lang }) => ({
        url: `/api/sigil/sessions/${sessionId}/blocks/sequence${lang ? `?lang=${lang}` : ""}`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: (result, error, { sessionId }) => [
        { type: "Session", id: sessionId },
      ],
    }),
  }),
});

export const {
  useCreateSigilSessionMutation,
  useContinueSigilSessionMutation,
  useGenerateSigilBlockSequenceMutation,
} = sigilApi;
