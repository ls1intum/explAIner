import { SOLO_TAXONOMY_DESCRIPTION } from '../../../../domain/didactical-frameworks/solo-taxonomy.util';
import { BlockSequenceMode } from '../../../../common/enums/block-sequence-mode.enum';
import type { WrongAnswer } from '../../../../common/types/practice-blocks.types';

interface GenerateBlockSequencePromptParams {
  mode: BlockSequenceMode;
  topic: string;
  learningGoal: string;
  bloomsLevel: string;
  priorKnowledge?: string;
  soloLevels: string[];
  wrongAnswers?: WrongAnswer[];
}

/**
 * Unified prompt for generating block sequences (initial or subsequent)
 */
export const generateBlockSequencePrompt = ({
  mode,
  topic,
  learningGoal,
  bloomsLevel,
  priorKnowledge,
  soloLevels,
  wrongAnswers,
}: GenerateBlockSequencePromptParams): string => {
  // Mode-specific configuration
  const isInitial = mode === BlockSequenceMode.INITIAL;
  const keyPointsLabel = isInitial ? 'keyFacts' : 'keyMisconceptions';
  const keyPointsDescription = isInitial
    ? 'key facts (2-4 items)'
    : 'key misconceptions to address (2-4 items)';
  const informBlockInstructions = isInitial
    ? 'Create educational content that teaches EVERYTHING needed to answer the practice questions:\n1. Start with a brief explanation (2-3 sentences) that connects the concepts\n2. List EXACTLY 3 or 4 key facts (NO MORE THAN 4) that directly address ALL concepts needed for the questions\n3. End with a one-sentence summary that frames the topic'
    : 'Create educational content that addresses misconceptions and teaches EVERYTHING needed to answer the practice questions:\n1. Start with a brief explanation (2-3 sentences) that connects the concepts\n2. List 2-4 key misconceptions that address the student\'s previous mistakes and clarify them\n3. End with a one-sentence summary that frames the topic';

  // Format wrong answers section (only for subsequent mode)
  const wrongAnswersText = !isInitial && wrongAnswers && wrongAnswers.length > 0
    ? `\n\n**Student's Previous Mistakes (to address in ${keyPointsLabel}):**
${wrongAnswers.map((wa) => `
Question: ${wa.question}
Correct Answer(s): ${wa.correctAnswerOptions.join(', ')}
Student Selected: ${wa.wrongStudentAnswerOptions.join(', ')}
`).join('\n')}`
    : '';

  // Format prior knowledge context if available
  const priorKnowledgeContext = priorKnowledge
    ? `\n\n**Prior Knowledge Context:**\nThe learner already has knowledge about: ${priorKnowledge}\nEnsure the questions and explanations build upon this existing knowledge appropriately.`
    : '';

  return `You are ExplAIner, an AI tutor. Generate a complete learning block sequence.

${SOLO_TAXONOMY_DESCRIPTION}

Topic: ${topic}
Learning Goal: ${learningGoal}
Bloom's Level: ${bloomsLevel}
Recommended SOLO Levels for practice: ${soloLevels.join(', ')}${priorKnowledgeContext}${wrongAnswersText}

Respond in English.

**IMPORTANT: Generate in this order:**
1. FIRST: Generate 3 practice questions
2. THEN: Generate 1 inform block that ${isInitial ? 'teaches' : 'addresses misconceptions and teaches'} everything needed for those questions

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
${informBlockInstructions}

**CRITICAL: The ${keyPointsLabel} array MUST contain between 2-4 items. Do NOT include more than 4 ${isInitial ? 'key facts' : 'key misconceptions'}.**

**Highlighting Instructions:**
- Use **bold** markdown syntax to highlight important terms, concepts, and key phrases
- Highlight 2-4 words per sentence that are most critical to understanding

**CRITICAL FORMAT REQUIREMENT:**
Return ONLY a pure JSON object. Do NOT wrap it in markdown code blocks or backticks.
Do NOT include \`\`\`json or \`\`\` before or after the JSON.
Your response should start with { and end with }

Expected format:
{
  "practiceBlocks": [
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
  ],
  "informBlock": {
    "explanation": "Brief 2-3 sentence explanation with **bold** for key terms that connects the concepts",
    "${keyPointsLabel}": [
      "${isInitial ? 'First key fact' : 'First misconception clarification'} with **bold terms**",
      "${isInitial ? 'Second key fact' : 'Second misconception'} addressing ${isInitial ? 'a concept' : 'student\'s mistake'}",
      "${isInitial ? 'Third key fact' : 'Third misconception'} with **highlighted concepts**"
    ],
    "summary": "One sentence overview with **bold key terms** that frames the topic"
  }
}

IMPORTANT: The ${keyPointsLabel} array must have 2-4 items maximum. In this example, there are 3 ${isInitial ? 'key facts' : 'key misconceptions'}.`;
};
