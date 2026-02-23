import { BlockSequenceMode } from '../../domain/schemas/enums.schema';

////////////////////////////////////////////////////////////
// Block helpers (blocks module only)
////////////////////////////////////////////////////////////

/** Build chat history from all messages on an inform block */
export function buildChatHistory(
  messages: Array<{ sender: string; message: string }>,
  newUserMessage?: string,
): string {
  const lines = messages.map((msg) => `${msg.sender}: ${msg.message}`);
  if (newUserMessage) lines.push(`User: ${newUserMessage}`);
  return lines.join('\n');
}

/** Build context for session summary text */
export function buildContextForSessionSummary(
  blocks: Array<{
    type: string;
    informBlock?: { messages?: { message?: string }[] } | null;
    practiceBlock?: { question: string; studentAnswerIsCorrect: boolean | null } | null;
  }>,
) {
  const informContent = blocks
    .filter((b) => b.type === 'Inform' && b.informBlock?.messages)
    .map((b) => b.informBlock!.messages![0]?.message ?? '');
  const practiceResults = blocks
    .filter((b) => b.type === 'Practice' && b.practiceBlock)
    .map((b) => ({
      question: b.practiceBlock!.question,
      isCorrect: b.practiceBlock!.studentAnswerIsCorrect ?? false,
    }));
  return { informContent, practiceResults };
}

/** Format inform block message: explanation + label + key points + summary */
export function formatInformBlockMessage(
  mode: BlockSequenceMode,
  informBlock: {
    explanation: string;
    summary: string;
  } & ({ keyFacts: string[] } | { keyMisconceptions: string[] }),
): string {
  const label = mode === BlockSequenceMode.INITIAL ? 'KEY FACTS' : 'KEY MISCONCEPTIONS';
  const keyPoints = 'keyFacts' in informBlock ? informBlock.keyFacts : informBlock.keyMisconceptions;
  const keyPointsText = keyPoints.join('\n');
  return `${informBlock.explanation}\n\n${label}\n${keyPointsText}\n\nSUMMARY\n${informBlock.summary}`;
}

/** Check student answer indices against correct indices */
export function isStudentAnswerCorrect(
  correctAnswerOptionIndices: number[],
  studentAnswerOptionIndices: number[],
): boolean {
  return (
    studentAnswerOptionIndices.length === correctAnswerOptionIndices.length &&
    studentAnswerOptionIndices.every((idx) => correctAnswerOptionIndices.includes(idx))
  );
}
