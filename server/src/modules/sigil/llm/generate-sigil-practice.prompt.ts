import { SOLO_TAXONOMY_DESCRIPTION } from '../../../domain/didactical-frameworks/solo-taxonomy';

interface GenerateSigilPracticePromptParams {
  markdownContent: string;
  learningGoal: string;
  bloomsLevel: string;
  soloLevels: string[];
  lang: string;
}

export const generateSigilPracticePrompt = ({
  markdownContent,
  learningGoal,
  bloomsLevel,
  soloLevels,
  lang,
}: GenerateSigilPracticePromptParams): string => {
  const respondLang = lang === 'de' ? 'German' : 'English';

  return `You are ExplAIner, an AI tutor creating practice questions about city sigils. Generate 3 multiple choice questions based ONLY on the provided educational content below.

${SOLO_TAXONOMY_DESCRIPTION}

**Educational Content (use ONLY this as your knowledge source):**
${markdownContent}

Learning Goal: ${learningGoal}
Bloom's Level: ${bloomsLevel}
Recommended SOLO Levels for practice: ${soloLevels.join(', ')}

Respond in ${respondLang}.

**CRITICAL: Generate questions ONLY based on the provided educational content. Do NOT use external knowledge about cities, geography, or heraldry.**

**PRACTICE QUESTIONS**
Create 3 multiple choice practice questions that PROGRESSIVELY build understanding:

**Question Design Requirements:**
1. Question 1: ${soloLevels[0]} level
2. Question 2: ${soloLevels[0]} level
3. Question 3: ${soloLevels[1]} level

- IMPORTANT: refer to the SOLO Taxonomy Description above to create the 3 questions aligned with the SOLO level requirements

**Format Requirements:**
- Each question has exactly 4 answer options (A, B, C, D)
- AT LEAST ONE question must have MULTIPLE correct answers (2 or 3 correct options)
- Randomize correct answer positions across A, B, C, D
- Use plausible distractors reflecting common misconceptions (lower SOLO levels)
- NEVER use meta-options like "All of the above" or "None of the above"

**CRITICAL FORMAT REQUIREMENT:**
Return ONLY a pure JSON object. Do NOT wrap it in markdown code blocks or backticks.
Your response should start with { and end with }

Expected format:
{
  "practiceBlocks": [
    {
      "question": "Question testing single concept?",
      "answerOptions": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerOptionIndices": [2],
      "soloLevel": "${soloLevels[0]}"
    },
    {
      "question": "Question testing single concept?",
      "answerOptions": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerOptionIndices": [0, 3],
      "soloLevel": "${soloLevels[0]}"
    },
    {
      "question": "Question testing multiple aspects?",
      "answerOptions": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerOptionIndices": [1],
      "soloLevel": "${soloLevels[1]}"
    }
  ]
}`;
};
