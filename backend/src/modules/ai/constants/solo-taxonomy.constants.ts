/**
 * SOLO (Structure of Observed Learning Outcomes) Taxonomy for Practice Question Design
 *
 * SOLO taxonomy provides a framework for designing practice questions that progressively
 * build understanding from simple recall to complex application.
 */

// This enum matches the Prisma SoloLevel enum exactly
export enum SOLOLevel {
  UNISTRUCTURAL = 'Unistructural',
  MULTISTRUCTURAL = 'Multistructural',
  RELATIONAL = 'Relational',
  EXTENDED_ABSTRACT = 'ExtendedAbstract',
}

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
 * Maps Bloom's taxonomy levels to appropriate SOLO levels for practice questions.
 */
export function getSOLOLevelsForBlooms(bloomsLevel: string): SOLOLevel[] {
  switch (bloomsLevel) {
    case 'Remember':
      return [SOLOLevel.UNISTRUCTURAL, SOLOLevel.MULTISTRUCTURAL];
    case 'Understand':
      return [SOLOLevel.MULTISTRUCTURAL, SOLOLevel.RELATIONAL];
    case 'Apply':
    case 'Analyze':
      return [SOLOLevel.RELATIONAL, SOLOLevel.EXTENDED_ABSTRACT];
    case 'Evaluate':
    case 'Create':
      return [SOLOLevel.RELATIONAL, SOLOLevel.EXTENDED_ABSTRACT];
    default:
      return [SOLOLevel.MULTISTRUCTURAL, SOLOLevel.RELATIONAL];
  }
}
