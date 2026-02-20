import { z } from 'zod';
import { SummaryBlockSchema } from '../base/summary-block.schema';

/** API endpoint: sessions/:sessionId/blocks/:orderIndex/messages
 * Type: request */
export const FollowUpQuestionMessageDtoSchema = z.object({
  message: z.string().min(1).describe('User message / follow-up question'),
});
export type FollowUpQuestionMessage = z.infer<typeof FollowUpQuestionMessageDtoSchema>;

/** API endpoint: sessions/:sessionId/blocks/:orderIndex/messages
 * Type: response */
export const FollowUpAnswerMessageDtoSchema = z.object({
  response: z.string().describe('AI response from Owlbert'),
});
export type FollowUpAnswerMessage = z.infer<typeof FollowUpAnswerMessageDtoSchema>;

const studentAnswerOptionIndicesSchema = z
  .array(z.number().int())
  .min(1, 'At least one answer option must be selected')
  .describe('Selected answer option indices (0-based)');

/** API endpoint: sessions/:sessionId/blocks/:orderIndex/student-answer
 * Type: request */
export const SubmitAnswerRequestDtoSchema = z.object({
  studentAnswerOptionIndices: studentAnswerOptionIndicesSchema,
});
export type SubmitAnswerRequest = z.infer<typeof SubmitAnswerRequestDtoSchema>;

/** API endpoint: sessions/:sessionId/blocks/:orderIndex/student-answer
 * Type: response */
export const SubmitAnswerResponseDtoSchema = z.object({
  success: z.boolean().describe('Whether the answer was persisted'),
  studentAnswerOptionIndices: z.array(z.number()).describe('Selected indices (0-based)').meta({ example: [0, 2] }),
});
export type SubmitAnswerResponse = z.infer<typeof SubmitAnswerResponseDtoSchema>;

/** API endpoint: sessions/:sessionId/blocks/sequence
 * Type: response */
export { BlockSequenceSchema } from '../base/block-sequence.schema';

/** API endpoint: sessions/:sessionId/blocks/summary
 * Type: response */
export const GenerateSummaryBlockResponseDtoSchema = SummaryBlockSchema.extend({
  sessionDuration: z.number().describe('Session duration in minutes'),
  totalBlocks: z.number().describe('Total number of blocks in the session'),
});
export type GenerateSummaryBlockResponse = z.infer<typeof GenerateSummaryBlockResponseDtoSchema>;
