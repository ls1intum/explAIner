import { z } from 'zod';
import { PracticeBlockQuestionParserSchema } from '../../../domain/schemas/llm-parser/block-sequence.schema';

export const SigilPracticeParserSchema = z.object({
  practiceBlocks: z.array(PracticeBlockQuestionParserSchema).length(3, 'Must have exactly 3 practice blocks'),
});
export type SigilPracticeParser = z.infer<typeof SigilPracticeParserSchema>;
