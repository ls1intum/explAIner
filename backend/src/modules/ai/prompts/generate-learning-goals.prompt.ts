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
1. Each goal MUST start with "After this session, you will be able to" followed by a Bloom's action verb
2. Each goal MUST be UNIQUE and cover a DIFFERENT aspect of the topic
3. Goals MUST increase in cognitive complexity:
   - Goal 1: Remember level (basic recall, identification)
   - Goal 2: Understand level (explanation, interpretation)
   - Goal 3: Apply or Analyze level (practical application or analysis)
4. Each goal MUST be BRIEF (max 30 words total)
5. Do NOT repeat similar content across goals
6. ${priorKnowledge ? 'SKIP any content the learner already knows based on their prior knowledge. Focus ONLY on new concepts.' : 'Cover the fundamentals if no prior knowledge is indicated.'}

Bloom's Taxonomy Action Verbs (use ONLY these after "you will be able to"):
- Remember: identify, list, name, recall, recognize, define, describe, locate, match, state
- Understand: explain, summarize, interpret, classify, compare, describe, discuss, distinguish, illustrate, paraphrase
- Apply: apply, demonstrate, solve, use, implement, execute, calculate, modify, operate, practice
- Analyze: analyze, compare, contrast, differentiate, examine, organize, categorize, deconstruct, investigate

Return ONLY a JSON array with exactly 3 objects:
[
  { "learningGoal": "After this session, you will be able to identify the three main components of...", "bloomsLevel": "Remember", "actionVerb": "identify" },
  { "learningGoal": "After this session, you will be able to explain how these components work together...", "bloomsLevel": "Understand", "actionVerb": "explain" },
  { "learningGoal": "After this session, you will be able to apply this knowledge to solve...", "bloomsLevel": "Apply", "actionVerb": "apply" }
]

The "actionVerb" field must contain the Bloom's action verb (the word right after "you will be able to").`;
};



