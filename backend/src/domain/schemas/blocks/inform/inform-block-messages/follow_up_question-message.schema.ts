import { z } from 'zod';
import { InformBlockMessageSchema } from '../../../../../../prisma/generated/zod';

/////////////////////////////////////////
// DTO SCHEMAS (REQUEST / RESPONSE)
/////////////////////////////////////////

/**
 * Follow-up Question Message Schema – request body for user message in inform block chat.
 * Used by generate-chat-response request DTO.
 */
export const followUpQuestionMessageSchema = z.object({
  message: InformBlockMessageSchema.shape.message.describe(
    'User message / follow-up question sent in the inform block chat',
  ),
});

export type FollowUpQuestionMessage = z.infer<typeof followUpQuestionMessageSchema>;
