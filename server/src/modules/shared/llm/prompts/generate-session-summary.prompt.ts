interface GenerateSessionSummaryPromptParams {
  topic: string;
  learningGoal: string;
  bloomsLevel: string;
  informContent: string[];
  practiceResults: Array<{
    question: string;
    isCorrect: boolean;
  }>;
  /** Language of the session's learning material ('de' | 'en'); null/undefined = English */
  lang?: string | null;
}

/** Prompt for generating the session summary text that is displayed on summary block */
export const generateSessionSummaryPrompt = ({
  topic,
  learningGoal,
  bloomsLevel,
  informContent,
  practiceResults,
  lang,
}: GenerateSessionSummaryPromptParams): string => {
  const respondLang = lang === 'de' ? 'German' : 'English';
  const contentSummary = informContent.length > 0
    ? informContent.map((content, i) => `Block ${i + 1}: ${content.substring(0, 300)}...`).join('\n---\n')
    : 'No content';

  const practiceResultsSummary = practiceResults.length > 0
    ? practiceResults.map((p) => `Q: ${p.question} - ${p.isCorrect ? 'Correct' : 'Incorrect'}`).join('\n')
    : 'No practice';

  return `You are ExplAIner, an AI tutor that guides learners through structured learning sessions. The learning session was just completed by the learner. Generate a session summary.

Topic: ${topic}
Learning Goal: ${learningGoal}
Bloom's Level: ${bloomsLevel}

Content covered:
${contentSummary}

Practice results:
${practiceResultsSummary}

Respond in ${respondLang} — the language of the learning material.

Create a brief, encouraging summary (2-3 paragraphs) that:
1. Recaps what was learned
2. Connects to the learning goal
3. Celebrates the achievement
4. Acknowledges any struggles and frames them as learning opportunities

**Guidelines:**
- Use **bold** for key terms
- Be supportive and motivational
- Keep it concise but meaningful

**CRITICAL FORMAT REQUIREMENT:**
Return ONLY a pure JSON object. Do NOT wrap it in markdown code blocks or backticks.
Do NOT include \`\`\`json or \`\`\` before or after the JSON.
Your response should start with { and end with }

Expected format:
{
  "sessionSummary": "Your comprehensive summary here (2-3 paragraphs with **bold**)..."
}`;
};
