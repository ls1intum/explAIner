interface GenerateEasierLearningGoalsPromptParams {
  topic: string;
  originalGoal: string;
  originalBloomsLevel: string;
  wrongQuestions?: string[];
  coveredContent?: string;
}

export const generateEasierLearningGoalsPrompt = ({
  topic,
  originalGoal,
  originalBloomsLevel,
  wrongQuestions,
  coveredContent,
}: GenerateEasierLearningGoalsPromptParams): string => {
  const wrongAnswersContext = wrongQuestions && wrongQuestions.length > 0
    ? `\n\nThe student struggled with these questions:\n${wrongQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`
    : '';

  const contentContext = coveredContent
    ? `\n\nContent that was covered in the session:\n${coveredContent}`
    : '';

  return `You are an expert instructional designer. A student was working on a learning session but found it too challenging. Generate 3 SIMPLER, more accessible learning goals.

ORIGINAL CONTEXT:
- Topic: ${topic}
- Original Goal: ${originalGoal}
- Original Bloom's Level: ${originalBloomsLevel}${wrongAnswersContext}${contentContext}

Write all learning goals in English.

CRITICAL REQUIREMENTS:
1. All 3 goals must be SIMPLER than the original "${originalGoal}"
2. Each goal MUST start with "After this session, you will be able to" followed by a Bloom's action verb
3. Focus on FOUNDATIONAL concepts that would help the student understand the topic better
4. Use LOWER Bloom's taxonomy levels (Remember, Understand) - avoid Apply, Analyse, Evaluate, Create
5. Each goal should be distinct and cover different foundational aspects
6. Goals should be BRIEF (max 25 words)

Bloom's Taxonomy Action Verbs for simpler goals:
- Remember: identify, list, name, recall, recognize, define, describe, locate, match, state
- Understand: explain, summarize, interpret, classify, compare, describe, discuss, distinguish, illustrate, paraphrase

Return ONLY a JSON array with exactly 3 objects:
[
  { "learningGoal": "After this session, you will be able to identify...", "bloomsLevel": "Remember", "actionVerb": "identify" },
  { "learningGoal": "After this session, you will be able to describe...", "bloomsLevel": "Remember", "actionVerb": "describe" },
  { "learningGoal": "After this session, you will be able to explain...", "bloomsLevel": "Understand", "actionVerb": "explain" }
]`;
};
