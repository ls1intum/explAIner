import { z } from "zod";

// Validate topic input, custom goals

export const topicInputSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters").max(500, "Topic must be less than 500 characters"),
  keywords: z.array(z.string()).optional(),
});

export const customGoalSchema = z.object({
  goal: z.string().min(5, "Goal must be at least 5 characters").max(300, "Goal must be less than 300 characters"),
});

export type TopicInput = z.infer<typeof topicInputSchema>;
export type CustomGoal = z.infer<typeof customGoalSchema>;
