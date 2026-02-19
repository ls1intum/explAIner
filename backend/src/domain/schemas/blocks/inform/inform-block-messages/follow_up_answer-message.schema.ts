import { z } from 'zod';
import { InformBlockMessageSchema as PrismaInformBlockMessageSchema } from '../../../../../../prisma/generated/zod';

/////////////////////////////////////////
// DTO SCHEMAS (REQUEST / RESPONSE)
/////////////////////////////////////////

/**
 * Follow-up Answer Message Schema – LLM response shape for Owlbert's reply in inform block chat.
 * Used by generate-chat-response chain and response DTO.
 */
export const followUpAnswerMessageSchema = z.object({
  response: PrismaInformBlockMessageSchema.shape.message.describe('AI response from Owlbert'),
});

export type FollowUpAnswerMessage = z.infer<typeof followUpAnswerMessageSchema>;
