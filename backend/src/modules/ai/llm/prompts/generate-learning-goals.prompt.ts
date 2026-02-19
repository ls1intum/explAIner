import { BLOOMS_TAXONOMY_DESCRIPTION } from '../../../../domain/didactical-frameworks/blooms-taxonomy.util';

interface GenerateLearningGoalsPromptParams {
  topic: string;
  priorKnowledge?: string;
}

export const generateLearningGoalsPrompt = ({ topic, priorKnowledge }: GenerateLearningGoalsPromptParams): string => {
  const priorKnowledgeContext = priorKnowledge
    ? `\n\nIMPORTANT - PRIOR KNOWLEDGE: The learner already knows about: ${priorKnowledge}
Do NOT include learning goals that cover concepts the learner already knows. Focus on NEW knowledge beyond what they already understand.`
    : '';

  return `You are an expert instructional designer. Generate exactly 3 DIFFERENT learning goals for the following topic, with INCREASING complexity based on Bloom's Taxonomy.

Topic: ${topic}${priorKnowledgeContext}

Write all learning goals in English.

CRITICAL REQUIREMENTS:
1. Each goal MUST follow this EXACT format: "After this session, you will be able to <BloomsLevel> <objective>."
   - BloomsLevel must be one of: Remember, Understand, Apply, Analyze, Evaluate, Create
   - The BloomsLevel should appear as a single word directly after "you will be able to"
   - Example: "After this session, you will be able to Remember the three main components of..."
2. Each goal MUST be UNIQUE and cover a DIFFERENT aspect of the topic
3. Goals MUST increase in cognitive complexity:
   - Goal 1: Remember level (basic recall, identification)
   - Goal 2: Understand level (explanation, interpretation)
   - Goal 3: Apply or Analyze level (practical application or analysis)
4. Each goal MUST be BRIEF (max 30 words total)
5. Do NOT repeat similar content across goals
6. ${priorKnowledge ? 'SKIP any content the learner already knows based on their prior knowledge. Focus ONLY on new concepts.' : 'Cover the fundamentals if no prior knowledge is indicated.'}

${BLOOMS_TAXONOMY_DESCRIPTION}

**CRITICAL FORMAT REQUIREMENT:**
Return ONLY a pure JSON array. Do NOT wrap it in markdown code blocks or backticks.
Do NOT include \`\`\`json or \`\`\` before or after the JSON.
Your response should start with [ and end with ]

Expected format - exactly 3 objects:
[
  { "learningGoal": "After this session, you will be able to Remember the three main components of...", "bloomsLevel": "Remember" },
  { "learningGoal": "After this session, you will be able to Understand how these components work together...", "bloomsLevel": "Understand" },
  { "learningGoal": "After this session, you will be able to Apply this knowledge to solve...", "bloomsLevel": "Apply" }
]

IMPORTANT: The learningGoal text must include the BloomsLevel word (e.g., "Remember", "Understand") right after "you will be able to".`;
};
