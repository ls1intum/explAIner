import { z } from 'zod';

export const BloomsLevelSchema = z.enum(['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create']);
export type BloomsLevel = z.infer<typeof BloomsLevelSchema>;

export const BlockTypeSchema = z.enum(['Inform', 'Practice', 'Summary']);
export type BlockType = z.infer<typeof BlockTypeSchema>;

export const MessageSenderSchema = z.enum(['User', 'Owlbert']);
export type MessageSender = z.infer<typeof MessageSenderSchema>;

export const SoloLevelSchema = z.enum(['Unistructural', 'Multistructural', 'Relational', 'ExtendedAbstract']);
export type SoloLevel = z.infer<typeof SoloLevelSchema>;

export const BlockSequenceModeSchema = z.enum(['initial', 'subsequent']);
export type BlockSequenceMode = z.infer<typeof BlockSequenceModeSchema>;
export const BlockSequenceMode = { INITIAL: 'initial', SUBSEQUENT: 'subsequent' } as const;
