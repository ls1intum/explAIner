interface GenerateSummaryBlockPromptParams {
  topic: string;
  learningGoal: string;
  bloomsLevel: string;
  informContent: string[];
  practiceResults: Array<{
    question: string;
    isCorrect: boolean;
  }>;
}

export const generateSummaryBlockPrompt = ({
  topic,
  learningGoal,
  bloomsLevel,
  informContent,
  practiceResults,
}: GenerateSummaryBlockPromptParams): string => {
  const contentSummary = informContent.length > 0
    ? informContent.map((content, i) => `Block ${i + 1}: ${content.substring(0, 300)}...`).join('\n---\n')
    : 'No content';

  const practiceResultsSummary = practiceResults.length > 0
    ? practiceResults.map((p) => `Q: ${p.question} - ${p.isCorrect ? 'Correct ✅' : 'Incorrect ❌'}`).join('\n')
    : 'No practice';

  return `You are ExplAIner. Generate a session summary.

Topic: ${topic}
Learning Goal: ${learningGoal}
Bloom's Level: ${bloomsLevel}

Content covered:
${contentSummary}

Practice results:
${practiceResultsSummary}

Respond in English.

Create a brief, encouraging summary (2-3 paragraphs) that:
1. Recaps what was learned
2. Connects to the learning goal
3. Celebrates the achievement
4. Acknowledges any struggles and frames them as learning opportunities

**Guidelines:**
- Use **bold** for key terms
- Add 1-2 encouraging emojis (💡, 🎯, ✨, 🎉)
- Be supportive and motivational
- Keep it concise but meaningful

Return ONLY a JSON object:
{
  "sessionSummary": "Your comprehensive summary here (2-3 paragraphs with **bold** and emojis)..."
}`;
};
