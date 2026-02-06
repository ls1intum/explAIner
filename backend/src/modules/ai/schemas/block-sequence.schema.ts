import { z } from 'zod';
import {
  initialInformBlockSchema,
  subsequentInformBlockSchema,
  unifiedInformBlockSchema,
} from './inform-block.schema';
import { practiceBlockSchema } from './practice-block.schema';

/**
 * Block Sequence Schema
 * 
 * This schema combines an Inform Block and a Practice Block.
 * Used for both initial and subsequent block sequences.
 */

// Combined block sequence schemas
export const initialBlockSequenceSchema = z.object({
  informBlock: initialInformBlockSchema,
  practiceBlock: practiceBlockSchema,
});

export const subsequentBlockSequenceSchema = z.object({
  informBlock: subsequentInformBlockSchema,
  practiceBlock: practiceBlockSchema,
});

// Unified block sequence schema
export const unifiedBlockSequenceSchema = z.object({
  informBlock: unifiedInformBlockSchema,
  practiceBlock: practiceBlockSchema,
});

// Re-export types from inform-block and practice-block schemas
export type {
  InitialInformBlock,
  SubsequentInformBlock,
  UnifiedInformBlock,
} from './inform-block.schema';
export type { PracticeQuestion, PracticeBlock } from './practice-block.schema';

// Inferred TypeScript types for block sequences
export type InitialBlockSequence = z.infer<typeof initialBlockSequenceSchema>;
export type SubsequentBlockSequence = z.infer<typeof subsequentBlockSequenceSchema>;
export type UnifiedBlockSequence = z.infer<typeof unifiedBlockSequenceSchema>;
