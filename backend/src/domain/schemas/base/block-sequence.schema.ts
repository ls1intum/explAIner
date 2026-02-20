import { z } from 'zod';
import { InformBlockSchema } from './inform-block.schema';
import { PracticeBlockSchema } from './practice-block.schema';

// Block sequence
export const BlockSequenceSchema = z.object({
  informBlock: InformBlockSchema.describe('Inform block introducing new content'),
  practiceBlocks: z.tuple([PracticeBlockSchema, PracticeBlockSchema, PracticeBlockSchema]).describe('Exactly 3 practice blocks'),
});
export type BlockSequence = z.infer<typeof BlockSequenceSchema>;
