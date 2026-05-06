import { SOLO_TAXONOMY_DESCRIPTION } from '../../../domain/didactical-frameworks/solo-taxonomy';
import type { WrongAnswer } from '../../../domain/schemas/llm-parser/block-sequence.schema';

interface GenerateSigilSubsequentPromptParams {
  markdownContent: string;
  learningGoal: string;
  bloomsLevel: string;
  soloLevels: string[];
  wrongAnswers: WrongAnswer[];
  lang: string;
}

export const generateSigilSubsequentPrompt = ({
  markdownContent,
  learningGoal,
  bloomsLevel,
  soloLevels,
  wrongAnswers,
  lang,
}: GenerateSigilSubsequentPromptParams): string => {
  const respondLang = lang === 'de' ? 'German' : 'English';

  const wrongAnswersText = wrongAnswers.length > 0
    ? `\n\n**Student's Previous Mistakes (to address in keyMisconceptions):**
${wrongAnswers.map((wa) => `
Question: ${wa.question}
Correct Answer(s): ${wa.correctAnswerOptions.join(', ')}
Student Selected: ${wa.wrongStudentAnswerOptions.join(', ')}
`).join('\n')}`
    : '';

  return `You are ExplAIner, an AI tutor creating a follow-up learning sequence about city sigils. The student answered some questions incorrectly. Generate educational content that addresses their misconceptions, then 3 new practice questions.

${SOLO_TAXONOMY_DESCRIPTION}

**Reference Educational Content (use as knowledge source):**
${markdownContent}

Learning Goal: ${learningGoal}
Bloom's Level: ${bloomsLevel}
Recommended SOLO Levels for practice: ${soloLevels.join(', ')}${wrongAnswersText}

Respond in ${respondLang}.

**CRITICAL: Base all content ONLY on the provided educational material. Do NOT use external knowledge.**

**IMPORTANT: Generate in this order:**
1. FIRST: Generate 3 practice questions
2. THEN: Generate 1 inform block that addresses misconceptions and teaches everything needed for those questions

**PART 1: PRACTICE QUESTIONS (Generate FIRST)**
Create 3 multiple choice practice questions:

**Question Design Requirements:**
1. Question 1: ${soloLevels[0]} level
2. Question 2: ${soloLevels[0]} level
3. Question 3: ${soloLevels[1]} level

**Format Requirements:**
- Each question has exactly 4 answer options (A, B, C, D)
- AT LEAST ONE question must have MULTIPLE correct answers (2 or 3 correct options)
- Randomize correct answer positions across A, B, C, D
- Use plausible distractors reflecting common misconceptions
- NEVER use meta-options like "All of the above" or "None of the above"

**PART 2: INFORM BLOCK (Generate AFTER practice questions)**
Create educational content that addresses misconceptions and teaches EVERYTHING needed to answer the practice questions:
1. Start with a brief explanation (2-3 sentences) that connects the concepts
2. List 2-4 key misconceptions that address the student's previous mistakes and clarify them
3. End with a one-sentence summary that frames the topic

**CRITICAL: The keyMisconceptions array MUST contain between 2-4 items.**

**Highlighting Instructions:**
- Use **bold** markdown syntax to highlight important terms, concepts, and key phrases

**CRITICAL FORMAT REQUIREMENT:**
Return ONLY a pure JSON object. Do NOT wrap it in markdown code blocks or backticks.
Your response should start with { and end with }

Expected format:
{
  "practiceBlocks": [
    {
      "question": "Question text?",
      "answerOptions": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerOptionIndices": [2],
      "soloLevel": "${soloLevels[0]}"
    },
    {
      "question": "Question text?",
      "answerOptions": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerOptionIndices": [0, 3],
      "soloLevel": "${soloLevels[0]}"
    },
    {
      "question": "Question text?",
      "answerOptions": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerOptionIndices": [1],
      "soloLevel": "${soloLevels[1]}"
    }
  ],
  "informBlock": {
    "explanation": "Brief 2-3 sentence explanation with **bold** for key terms",
    "keyMisconceptions": [
      "First misconception clarification with **bold terms**",
      "Second misconception addressing student's mistake"
    ],
    "summary": "One sentence overview with **bold key terms**"
  }
}`;
};
