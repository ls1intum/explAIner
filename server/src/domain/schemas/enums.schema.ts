import { z } from 'zod';

// Blooms Level
export const BloomsLevelSchema = z.enum(['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create']);
export type BloomsLevel = z.infer<typeof BloomsLevelSchema>;

// Solo Level
export const SoloLevelSchema = z.enum(['Unistructural', 'Multistructural', 'Relational', 'ExtendedAbstract']);
export type SoloLevel = z.infer<typeof SoloLevelSchema>;
export const SoloLevel = {
  Unistructural: 'Unistructural',
  Multistructural: 'Multistructural',
  Relational: 'Relational',
  ExtendedAbstract: 'ExtendedAbstract',
} as const;

// Block Sequence Mode
export const BlockSequenceModeSchema = z.enum(['initial', 'subsequent']);
export type BlockSequenceMode = z.infer<typeof BlockSequenceModeSchema>;
export const BlockSequenceMode = { INITIAL: 'initial', SUBSEQUENT: 'subsequent' } as const;

// Block Type
export const BlockTypeSchema = z.enum(['Inform', 'Practice', 'Summary']);
export type BlockType = z.infer<typeof BlockTypeSchema>;
export const BlockType = { Inform: 'Inform', Practice: 'Practice', Summary: 'Summary' } as const;

// Message Sender
export const MessageSenderSchema = z.enum(['User', 'Owlbert']);
export type MessageSender = z.infer<typeof MessageSenderSchema>;