import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { SoloLevel } from '@prisma/client';



// Inform Block Message Schema (API response with DB fields)
const informBlockMessageSchema = z.object({
  id: z.string().describe('Message ID'),
  blockId: z.string().describe('Block ID this message belongs to'),
  message: z.string().describe('Message content'),
  sender: z.enum(['User', 'Owlbert']).describe('Message sender'),
  timestamp: z.string().datetime().describe('Message timestamp (ISO 8601 format)'),
});
export class InformBlockMessageDto extends createZodDto(informBlockMessageSchema) {}



// Practice Block Schema (API response with DB and student answer fields)
const practiceBlockResponseSchema = z.object({
  blockId: z.string().describe('Block ID'),
  soloLevel: z.nativeEnum(SoloLevel).describe('SOLO taxonomy level'),
  question: z.string().describe('Practice question'),
  answerOptions: z.array(z.string()).describe('Available answer options'),
  correctAnswerOptionIndices: z.array(z.number()).describe('Indices of correct answer options'),
  studentAnswerOptionIndices: z.array(z.number()).describe('Indices of student\'s selected answer options'),
  studentAnswerIsCorrect: z.boolean().nullable().describe('Whether the student\'s answer is correct (null if not yet answered)'),
});
export class PracticeBlockDto extends createZodDto(practiceBlockResponseSchema) {}



// Summary Block Schema (API response with DB fields)
const summaryBlockResponseSchema = z.object({
  blockId: z.string().describe('Block ID'),
  sessionSummary: z.string().describe('Session summary content'),
});
export class SummaryBlockDto extends createZodDto(summaryBlockResponseSchema) {}



// Get Block Response Schema (API response with DB fields and polymorphic block data)
const getBlockResponseSchema = z.object({
  id: z.string().describe('Block ID'),
  sessionId: z.string().describe('Session ID this block belongs to'),
  orderIndex: z.number().describe('Order index of the block (0-based)'),
  alreadyViewed: z.boolean().describe('Whether the block has been viewed by the user already'),
  type: z.enum(['Inform', 'Practice', 'Summary']).describe('Block type'),
  informBlockMessages: z.array(informBlockMessageSchema).optional().describe('Inform block messages (only for Inform blocks)'),
  practiceBlock: practiceBlockResponseSchema.optional().describe('Practice block data (only for Practice blocks)'),
  summaryBlock: summaryBlockResponseSchema.optional().describe('Summary block data (only for Summary blocks)'),
});
export class GetBlockResponseDto extends createZodDto(getBlockResponseSchema) {}

