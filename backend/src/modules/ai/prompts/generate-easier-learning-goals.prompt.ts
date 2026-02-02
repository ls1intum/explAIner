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
2. Each goal MUST follow this EXACT format: "After this session, you will be able to <BloomsLevel> <objective>."
   - BloomsLevel must be one of: Remember, Understand, Apply, Analyze, Evaluate, Create
   - The BloomsLevel should appear as a single word directly after "you will be able to"
   - Example: "After this session, you will be able to Remember the three main components of..."
3. Focus on FOUNDATIONAL concepts that would help the student understand the topic better
4. Use LOWER Bloom's taxonomy levels (Remember, Understand) - avoid Apply, Analyze, Evaluate, Create
5. Each goal should be distinct and cover different foundational aspects
6. Goals should be BRIEF (max 25 words)

Bloom's Taxonomy Levels for simpler goals:
- Remember: Basic recall and recognition
- Understand: Explanation and interpretation

Return ONLY a JSON array with exactly 3 objects:
[
  { "learningGoal": "After this session, you will be able to Remember the three main components of...", "bloomsLevel": "Remember" },
  { "learningGoal": "After this session, you will be able to Remember the basic principles of...", "bloomsLevel": "Remember" },
  { "learningGoal": "After this session, you will be able to Understand how these components work together...", "bloomsLevel": "Understand" }
]

IMPORTANT: The learningGoal text must include the BloomsLevel word (e.g., "Remember", "Understand") right after "you will be able to".`;
};
