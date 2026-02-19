import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const SessionScalarFieldEnumSchema = z.enum(['id','topic','learningGoal','learningGoalBloomsLevel','priorKnowledge','totalBlocks','currentBlockIndex','userFeedback','startedAt','completedAt']);

export const BlockScalarFieldEnumSchema = z.enum(['id','sessionId','orderIndex','alreadyViewed','type']);

export const InformBlockScalarFieldEnumSchema = z.enum(['blockId']);

export const InformBlockMessageScalarFieldEnumSchema = z.enum(['id','informBlockId','message','sender','timestamp']);

export const PracticeBlockScalarFieldEnumSchema = z.enum(['blockId','soloLevel','question','answerOptions','correctAnswerOptionIndices','studentAnswerOptionIndices','studentAnswerIsCorrect']);

export const SummaryBlockScalarFieldEnumSchema = z.enum(['blockId','sessionSummary']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const BloomsLevelSchema = z.enum(['Remember','Understand','Apply','Analyze','Evaluate','Create']);

export type BloomsLevelType = `${z.infer<typeof BloomsLevelSchema>}`

export const BlockTypeSchema = z.enum(['Inform','Practice','Summary']);

export type BlockTypeType = `${z.infer<typeof BlockTypeSchema>}`

export const MessageSenderSchema = z.enum(['User','Owlbert']);

export type MessageSenderType = `${z.infer<typeof MessageSenderSchema>}`

export const SoloLevelSchema = z.enum(['Unistructural','Multistructural','Relational','ExtendedAbstract']);

export type SoloLevelType = `${z.infer<typeof SoloLevelSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// SESSION SCHEMA
/////////////////////////////////////////

export const SessionSchema = z.object({
  learningGoalBloomsLevel: BloomsLevelSchema,
  id: z.uuid(),
  topic: z.string(),
  learningGoal: z.string(),
  priorKnowledge: z.string().nullable(),
  totalBlocks: z.number().int(),
  currentBlockIndex: z.number().int(),
  userFeedback: z.number().int().nullable(),
  startedAt: z.coerce.date(),
  completedAt: z.coerce.date().nullable(),
})

export type Session = z.infer<typeof SessionSchema>

/////////////////////////////////////////
// BLOCK SCHEMA
/////////////////////////////////////////

export const BlockSchema = z.object({
  type: BlockTypeSchema,
  id: z.uuid(),
  sessionId: z.string(),
  orderIndex: z.number().int(),
  alreadyViewed: z.boolean(),
})

export type Block = z.infer<typeof BlockSchema>

/////////////////////////////////////////
// INFORM BLOCK SCHEMA
/////////////////////////////////////////

export const InformBlockSchema = z.object({
  blockId: z.string(),
})

export type InformBlock = z.infer<typeof InformBlockSchema>

/////////////////////////////////////////
// INFORM BLOCK MESSAGE SCHEMA
/////////////////////////////////////////

export const InformBlockMessageSchema = z.object({
  sender: MessageSenderSchema,
  id: z.uuid(),
  informBlockId: z.string(),
  message: z.string(),
  timestamp: z.coerce.date(),
})

export type InformBlockMessage = z.infer<typeof InformBlockMessageSchema>

/////////////////////////////////////////
// PRACTICE BLOCK SCHEMA
/////////////////////////////////////////

export const PracticeBlockSchema = z.object({
  soloLevel: SoloLevelSchema,
  blockId: z.string(),
  question: z.string(),
  answerOptions: z.string().array(),
  correctAnswerOptionIndices: z.number().int().array(),
  studentAnswerOptionIndices: z.number().int().array(),
  studentAnswerIsCorrect: z.boolean().nullable(),
})

export type PracticeBlock = z.infer<typeof PracticeBlockSchema>

/////////////////////////////////////////
// SUMMARY BLOCK SCHEMA
/////////////////////////////////////////

export const SummaryBlockSchema = z.object({
  blockId: z.string(),
  sessionSummary: z.string(),
})

export type SummaryBlock = z.infer<typeof SummaryBlockSchema>
