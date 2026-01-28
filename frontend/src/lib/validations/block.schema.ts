import { z } from "zod";

// Validate answer submissions

export const answerSubmissionSchema = z.object({
  blockId: z.string().uuid(),
  answerId: z.string(),
  timeSpent: z.number().min(0),
});

export type AnswerSubmission = z.infer<typeof answerSubmissionSchema>;
