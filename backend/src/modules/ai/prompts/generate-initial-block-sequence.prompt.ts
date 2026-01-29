import { SOLO_TAXONOMY_DESCRIPTION } from '../constants/solo-taxonomy.constants';

interface GenerateInitialBlockSequencePromptParams {
  topic: string;
  learningGoal: string;
  bloomsLevel: string;
  keyConcepts: string[];
  soloLevels: string[];
}

export const generateInitialBlockSequencePrompt = ({
  topic,
  learningGoal,
  bloomsLevel,
  keyConcepts,
  soloLevels,
}: GenerateInitialBlockSequencePromptParams): string => {
  return `You are ExplAIner, an AI tutor. Generate a complete learning block sequence with INFORM content followed by PRACTICE questions.

${SOLO_TAXONOMY_DESCRIPTION}

Topic: ${topic}
Learning Goal: ${learningGoal}
Bloom's Level: ${bloomsLevel}
Recommended SOLO Levels: ${soloLevels.join(', ')}

**Key concepts that MUST be covered:**
${keyConcepts.map((c: string) => `- ${c}`).join('\n')}

Respond in English.

**PART 1: INFORM BLOCK**
Create educational content that teaches the key concepts:
1. Start with a brief summary that frames the topic
2. List 3-4 key facts that directly address the concepts
3. Provide a brief explanation connecting the concepts

**Highlighting Instructions:**
- Use **bold** markdown syntax to highlight important terms, concepts, and key phrases
- Highlight 2-4 words per sentence that are most critical to understanding

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
    "summary": "One sentence overview with **bold key terms** 💡",
    "keyFacts": [
      "First key fact with **bold terms** 📚",
      "Second key fact addressing a concept 🎯",
      "Third key fact with **highlighted concepts**",
      "Fourth key fact if needed"
    ],
    "explanation": "Brief 2-3 sentence explanation with **bold** for key terms 💡"
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
