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

/**
 * Fixed summary text used when the LLM cannot generate one (e.g. logos does not
 * answer), so the learner still reaches the end of the session.
 */
export function buildFallbackSessionSummary(
  learningGoal: string,
  practiceResults: Array<{ isCorrect: boolean }>,
  lang?: string | null,
): string {
  const correct = practiceResults.filter((p) => p.isCorrect).length;
  const total = practiceResults.length;
  if (lang === 'de') {
    const practice = total > 0 ? ` Du hast **${correct} von ${total}** Übungsfragen richtig beantwortet.` : '';
    return `Geschafft – du hast die Lerneinheit abgeschlossen!${practice}\n\n**Lernziel:** ${learningGoal}`;
  }
  const practice = total > 0 ? ` You answered **${correct} of ${total}** practice questions correctly.` : '';
  return `Well done – you have completed the learning session!${practice}\n\n**Learning goal:** ${learningGoal}`;
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
