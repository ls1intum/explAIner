import { BLOOMS_TAXONOMY_DESCRIPTION } from '../../../../domain/didactical-frameworks/blooms-taxonomy';

interface GenerateEasierLearningGoalsPromptParams {
  topic: string;
  originalGoal: string;
  originalBloomsLevel: string;
  wrongQuestions?: string[];
  coveredContent?: string;
}

/** Prompt for generating 3 easier learning goals for a new session based on previous session content & wrong answers to previous practice questions */
export const generateEasierLearningGoalsPrompt = ({
  topic,
  originalGoal,
  originalBloomsLevel,
  wrongQuestions,
  coveredContent,
}: GenerateEasierLearningGoalsPromptParams): string => {
  const wrongAnswersContext = wrongQuestions && wrongQuestions.length > 0
    ? `\n\nIMPORTANT - STUDENT STRUGGLES: The student struggled with these practice questions, indicating misconceptions in the following areas:\n${wrongQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n\n')}\n\nThe new learning goals should ADDRESS THESE MISCONCEPTIONS and focus on the FUNDAMENTAL CONCEPTS the student needs to understand before tackling the original goal.`
    : '';

  const contentContext = coveredContent
    ? `\n\nContent already covered in the session:\n${coveredContent.substring(0, 10000)}...`
    : '';

  return `You are an expert instructional designer. A student was working on a learning session but found it too challenging. Your task is to generate 3 SIMPLER, more accessible learning goals that focus on FOUNDATIONAL CONCEPTS.

ORIGINAL CONTEXT:
- Topic: ${topic}
- Original Goal: ${originalGoal}
- Original Bloom's Level: ${originalBloomsLevel}${wrongAnswersContext}${contentContext}

Write all learning goals in English.

CRITICAL REQUIREMENTS:
1. All 3 goals MUST be SIMPLER than the original "${originalGoal}"
2. Each goal MUST follow this EXACT format: "After this session, I can <BloomsLevel> <objective>."
   - BloomsLevel must be one of: Remember, Understand, Apply, Analyze, Evaluate, Create
   - The BloomsLevel should appear as a single word directly after "I can"
   - Example: "After this session, I can Remember the three main components of..."
3. Focus on FOUNDATIONAL concepts that address the student's misconceptions identified in the wrong practice questions
4. Use LOWER Bloom's taxonomy levels (Remember, Understand) - avoid Apply, Analyze, Evaluate, Create
5. Each goal MUST be UNIQUE and cover a DIFFERENT foundational aspect
6. Goals should be BRIEF (max 30 words total)
7. The goals should help the student BUILD UP to the original goal by mastering prerequisites first

${BLOOMS_TAXONOMY_DESCRIPTION}

Focus on lower Bloom's levels for simpler goals:
- Remember: Basic recall and recognition
- Understand: Explanation and interpretation

**CRITICAL FORMAT REQUIREMENT:**
Return ONLY a pure JSON array. Do NOT wrap it in markdown code blocks or backticks.
Do NOT include \`\`\`json or \`\`\` before or after the JSON.
Your response should start with [ and end with ]

Expected format - exactly 3 objects:
[
  { "learningGoal": "After this session, I can Remember the three main components of...", "bloomsLevel": "Remember" },
  { "learningGoal": "After this session, I can Remember the basic principles of...", "bloomsLevel": "Remember" },
  { "learningGoal": "After this session, I can Understand how these components work together...", "bloomsLevel": "Understand" }
]

IMPORTANT: The learningGoal text must include the BloomsLevel word (e.g., "Remember", "Understand") right after "I can".`;
};
