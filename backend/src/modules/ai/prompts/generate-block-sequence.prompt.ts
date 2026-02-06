import { SOLO_TAXONOMY_DESCRIPTION } from '../../../common/utils/didactical-frameworks/solo-taxonomy.util';
import { BlockSequenceMode } from '../../../common/enums/block-sequence-mode.enum';
import type { WrongAnswer } from '../../../common/types/practice-blocks.types';

interface GenerateBlockSequencePromptParams {
  mode: BlockSequenceMode;
  topic: string;
  learningGoal: string;
  bloomsLevel: string;
  priorKnowledge?: string;
  soloLevels: string[];
  wrongAnswers?: WrongAnswer[];
}

export const generateBlockSequencePrompt = ({
  mode,
  topic,
  learningGoal,
  bloomsLevel,
  priorKnowledge,
  soloLevels,
  wrongAnswers,
}: GenerateBlockSequencePromptParams): string => {
  // Format wrong answers section (only for SUBSEQUENT mode)
  const wrongAnswersText = wrongAnswers && wrongAnswers.length > 0 && mode === BlockSequenceMode.SUBSEQUENT
    ? `\n\n**Student's Previous Mistakes (to address in ${mode === BlockSequenceMode.SUBSEQUENT ? 'keyMisconceptions' : 'keyFacts'}):**
${wrongAnswers.map((wa) => `
Question: ${wa.question}
Correct Answer(s): ${wa.correctAnswerOptions.join(', ')}
Student Selected: ${wa.wrongStudentAnswerOptions.join(', ')}
`).join('\n')}`
    : '';

  // Determine inform block field name and instructions based on mode
  const informBlockFieldName = mode === BlockSequenceMode.INITIAL ? 'keyFacts' : 'keyMisconceptions';
  const informBlockInstructions = mode === BlockSequenceMode.INITIAL
    ? '2. List EXACTLY 3 or 4 key facts (NO MORE THAN 4) that directly address ALL concepts needed for the questions'
    : '2. List 2-4 key misconceptions that address the student\'s previous mistakes and clarify them';
  const informBlockCritical = mode === BlockSequenceMode.INITIAL
    ? `**CRITICAL: The ${informBlockFieldName} array MUST contain between 2-4 items. Do NOT include more than 4 key facts.**`
    : `**CRITICAL: The ${informBlockFieldName} array MUST contain between 2-4 items. Do NOT include more than 4 misconceptions.**`;

  const generateOrderInstruction = mode === BlockSequenceMode.INITIAL
    ? '2. THEN: Generate 1 inform block that teaches everything needed for those questions'
    : '2. THEN: Generate 1 inform block that addresses misconceptions and teaches everything needed for those questions';

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
${generateOrderInstruction}

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
Create educational content that${mode === BlockSequenceMode.SUBSEQUENT ? ' addresses misconceptions and' : ''} teaches EVERYTHING needed to answer the practice questions:
1. Start with a brief explanation (2-3 sentences) that connects the concepts
${informBlockInstructions}
3. End with a one-sentence summary that frames the topic

${informBlockCritical}

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
    "${informBlockFieldName}": [
      "First ${mode === BlockSequenceMode.INITIAL ? 'key fact' : 'misconception clarification'} with **bold terms**",
      "Second ${mode === BlockSequenceMode.INITIAL ? 'key fact addressing a concept' : 'misconception addressing student\'s mistake'}",
      "Third ${mode === BlockSequenceMode.INITIAL ? 'key fact' : 'misconception'} with **highlighted concepts**"
    ],
    "summary": "One sentence overview with **bold key terms** that frames the topic"
  }
}

IMPORTANT: The ${informBlockFieldName} array must have 2-4 items maximum. In this example, there are 3 ${mode === BlockSequenceMode.INITIAL ? 'key facts' : 'key misconceptions'}.`;
};
