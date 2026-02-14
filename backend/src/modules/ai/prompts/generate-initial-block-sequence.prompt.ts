import { SOLO_TAXONOMY_DESCRIPTION } from '../../../common/utils/didactical-frameworks/solo-taxonomy.util';

interface GenerateInitialBlockSequencePromptParams {
  topic: string;
  learningGoal: string;
  bloomsLevel: string;
  priorKnowledge?: string;
  soloLevels: string[];
}

/**
 * Prompt for generating initial block sequence (block_sequence_counter = 0)
 * Generates: inform block with keyFacts + practice block
 */
export const generateInitialBlockSequencePrompt = ({
  topic,
  learningGoal,
  bloomsLevel,
  priorKnowledge,
  soloLevels,
}: GenerateInitialBlockSequencePromptParams): string => {
  // Format prior knowledge context if available
  const priorKnowledgeContext = priorKnowledge
    ? `\n\n**Prior Knowledge Context:**\nThe learner already has knowledge about: ${priorKnowledge}\nEnsure the questions and explanations build upon this existing knowledge appropriately.`
    : '';

  return `You are ExplAIner, an AI tutor. Generate a complete learning block sequence.

${SOLO_TAXONOMY_DESCRIPTION}

Topic: ${topic}
Learning Goal: ${learningGoal}
Bloom's Level: ${bloomsLevel}
Recommended SOLO Levels for practice: ${soloLevels.join(', ')}${priorKnowledgeContext}

Respond in English.

**IMPORTANT: Generate in this order:**
1. FIRST: Generate 3 practice questions
2. THEN: Generate 1 inform block that teaches everything needed for those questions

**PART 1: PRACTICE QUESTIONS (Generate FIRST)**
Create 3 multiple choice practice questions that PROGRESSIVELY build understanding:

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

**PART 2: INFORM BLOCK (Generate AFTER practice questions)**
Create educational content that teaches EVERYTHING needed to answer the practice questions:
1. Start with a brief explanation (2-3 sentences) that connects the concepts
2. List EXACTLY 3 or 4 key facts (NO MORE THAN 4) that directly address ALL concepts needed for the questions
3. End with a one-sentence summary that frames the topic

**CRITICAL: The keyFacts array MUST contain between 2-4 items. Do NOT include more than 4 key facts.**

**Highlighting Instructions:**
- Use **bold** markdown syntax to highlight important terms, concepts, and key phrases
- Highlight 2-4 words per sentence that are most critical to understanding

**CRITICAL FORMAT REQUIREMENT:**
Return ONLY a pure JSON object. Do NOT wrap it in markdown code blocks or backticks.
Do NOT include \`\`\`json or \`\`\` before or after the JSON.
Your response should start with { and end with }

Expected format:
{
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
  },
  "informBlock": {
    "explanation": "Brief 2-3 sentence explanation with **bold** for key terms that connects the concepts",
    "keyFacts": [
      "First key fact with **bold terms**",
      "Second key fact addressing a concept",
      "Third key fact with **highlighted concepts**"
    ],
    "summary": "One sentence overview with **bold key terms** that frames the topic"
  }
}

IMPORTANT: The keyFacts array must have 2-4 items maximum. In this example, there are 3 key facts.`;
};
