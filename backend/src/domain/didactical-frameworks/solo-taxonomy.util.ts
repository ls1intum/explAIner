import { SoloLevel } from '../schemas/enums.schema';

/**
 * SOLO (Structure of Observed Learning Outcomes) Taxonomy for Practice Question Design
 *
 * The SOLO taxonomy is a framework for designing practice questions in a way that
 * allows to assess the structural quality of a learner's response.
 * 
 * This file provides a description which is used as context in the AI prompts.
 */

export const SOLO_TAXONOMY_DESCRIPTION = `
SOLO (Structure of Observed Learning Outcomes) Taxonomy for Multiple Choice Question Design:

**Levels & MCQ Design:**

1. **Unistructural** (one aspect)
   - Focus on single, isolated fact or concept
   - Recall or identify one relevant piece of information
   - Example question type: "What is X?"

2. **Multistructural** (multiple aspects, unconnected)
   - Address several relevant aspects independently
   - List, enumerate, or describe multiple elements
   - Example question type: "Which of these are characteristics of X?"

3. **Relational** (integrated understanding)
   - Require integration of multiple aspects into coherent whole
   - Compare, explain relationships, analyze cause-effect
   - Example question type: "How does X relate to Y?" or "Why does X lead to Y?"

4. **Extended Abstract** (generalization & transfer)
   - Apply understanding to new/hypothetical contexts
   - Predict, hypothesize, generalize beyond given information
   - Example question type: "What would happen if..." or "How would X apply in context Y?"

**Key Principles:**
- Align question complexity with learning goal's Bloom's level
- Use distractors strategically: wrong answers should reflect lower SOLO levels (common misconceptions or partial understanding)
- Progress from simple → complex: start with Unistructural/Multistructural, advance to Relational
- **Relational = sweet spot** for meaningful learning assessment in practice blocks
`;

/**
 * Maps Bloom's taxonomy levels to appropriate SOLO levels for practice questions
 */
export function getSOLOLevelsForBlooms(bloomsLevel: string): SoloLevel[] {
  switch (bloomsLevel) {
    case 'Remember':
      return [SoloLevel.Unistructural, SoloLevel.Multistructural];
    case 'Understand':
      return [SoloLevel.Multistructural, SoloLevel.Relational];
    case 'Apply':
    case 'Analyze':
      return [SoloLevel.Relational, SoloLevel.ExtendedAbstract];
    case 'Evaluate':
    case 'Create':
      return [SoloLevel.Relational, SoloLevel.ExtendedAbstract];
    default:
      return [SoloLevel.Multistructural, SoloLevel.Relational];
  }
}
