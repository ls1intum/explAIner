import { SOLO_TAXONOMY_DESCRIPTION } from '../constants/solo-taxonomy.constants';

interface GenerateSubsequentBlockSequencePromptParams {
  topic: string;
  learningGoal: string;
  bloomsLevel: string;
  keyConcepts: string[];
  soloLevels: string[];
  previousContent?: string;
  mistakeAnalysis?: string;
  existingQuestions?: string[];
}

export const generateSubsequentBlockSequencePrompt = ({
  topic,
  learningGoal,
  bloomsLevel,
  keyConcepts,
  soloLevels,
  previousContent,
  mistakeAnalysis,
  existingQuestions,
}: GenerateSubsequentBlockSequencePromptParams): string => {
  const contextText = previousContent
    ? `\n\nPrevious content covered:\n${previousContent}`
    : '';

  const mistakeText = mistakeAnalysis
    ? `\n\n${mistakeAnalysis}`
    : '';

  const existingQuestionsText = existingQuestions && existingQuestions.length > 0
    ? `\n\nDO NOT repeat these questions:\n${existingQuestions.map((q) => `- ${q}`).join('\n')}`
    : '';

  return `You are ExplAIner, an AI tutor. Generate a complete learning block sequence with INFORM content followed by PRACTICE questions.

${SOLO_TAXONOMY_DESCRIPTION}

Topic: ${topic}
Learning Goal: ${learningGoal}
Bloom's Level: ${bloomsLevel}
Recommended SOLO Levels: ${soloLevels.join(', ')}${contextText}${mistakeText}

**Key concepts that MUST be covered:**
${keyConcepts.map((c: string) => `- ${c}`).join('\n')}${existingQuestionsText}

Respond in English.

**PART 1: INFORM BLOCK**
Create content that:
1. Briefly addresses any misconceptions from previous practice (if applicable)
2. Teaches the NEW concepts needed to answer the upcoming practice questions
3. Keep it SHORT and focused (1 paragraph max for each section)

**Highlighting & Emoji Instructions:**
- Use **bold** for key terms, 1-2 emojis per section

**PART 2: PRACTICE BLOCK**
Generate 3 multiple choice practice questions that PROGRESSIVELY build understanding:

**Question Design Requirements:**
1. Question 1 (${soloLevels[0]} level): Test a single key concept or fact
2. Question 2 (${soloLevels[0]} or Multistructural level): Test multiple aspects or elements
3. Question 3 (${soloLevels[1] || 'Relational'} level): Test integration, relationships, or application

**Format Requirements:**
- Each question has exactly 4 answer options (A, B, C, D)
- AT LEAST ONE question must have MULTIPLE correct answers (2 or 3 correct options)
- Randomize correct answer positions across A, B, C, D
- Use plausible distractors reflecting common misconceptions (lower SOLO levels)
- NEVER use meta-options like "All of the above" or "None of the above"

Return ONLY a JSON object:
{
  "informBlock": {
    "summary": "One sentence with **bold** 💡",
    "keyMisconceptions": [
      "Brief misconception fix with **bold** 🤔"
    ],
    "explanation": "SHORT explanation covering NEW concepts with **bold** 💡"
  },
  "practiceBlock": {
    "questions": [
      {
        "question": "Question testing single concept?",
        "answerOptions": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswerOptionIndices": [2],
        "soloLevel": "Unistructural"
      },
      {
        "question": "Question testing multiple aspects?",
        "answerOptions": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswerOptionIndices": [0, 3],
        "soloLevel": "Multistructural"
      },
      {
        "question": "Question requiring integration/application?",
        "answerOptions": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswerOptionIndices": [1],
        "soloLevel": "Relational"
      }
    ]
  }
}`;
};
