import { BlockType } from '../../domain/schemas/enums.schema';
import type { WrongAnswer } from '../../domain/schemas/llm-parser/block-sequence.schema';

////////////////////////////////////////////////////////////
// Learning Goals helpers (learning-goals module only)
////////////////////////////////////////////////////////////

/** Format WrongAnswer schema to strings for LLM prompt (generate-easier-learning-goals) */
export function formatWrongAnswersForPrompt(wrongAnswers: WrongAnswer[]): string[] {
  return wrongAnswers.map(
    (wa) =>
      `Question: ${wa.question}\nCorrect Answer(s): ${wa.correctAnswerOptions.join(', ')}\nStudent's Answer(s): ${wa.wrongStudentAnswerOptions.join(', ')}`,
  );
}

/** Extracts covered content from all inform block messages (concatenates into one string) */
export function extractCoveredContentFromInformBlocks(
  blocks: Array<{
    type: BlockType;
    informBlock?: { messages: { message: string }[] } | null;
  }>,
): string {
  return blocks
    .filter((b) => b.type === BlockType.Inform && b.informBlock?.messages)
    .map((b) => b.informBlock!.messages.map((m) => m.message).join('\n'))
    .join('\n\n');
}