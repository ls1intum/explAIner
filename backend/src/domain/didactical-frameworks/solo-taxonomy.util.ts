import { SoloLevel } from '@prisma/client';

/**
 * SOLO (Structure of Observed Learning Outcomes) Taxonomy for Practice Question Design
 *
 * SOLO taxonomy provides a framework for designing practice questions that progressively
 * build understanding from simple recall to complex application.
 *
 * Unlike Bloom's focus on cognitive processes, SOLO measures the structural quality of
 * a learner's response—how many elements they connect and how abstractly they can extend
 * their understanding.
 *
 * This file provides SOLO taxonomy descriptions and helper functions for AI prompts.
 * SoloLevel enum is imported from Prisma (single source of truth).
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
 * Maps Bloom's taxonomy levels to appropriate SOLO levels for practice questions.
 *
 * Mapping guide:
 * - Remember → Unistructural, Multistructural (single/multiple connections)
 * - Understand → Multistructural, Relational (multiple separate connections to integrated)
 * - Apply/Analyze → Relational, Extended Abstract (integrated to generalized)
 * - Evaluate/Create → Relational, Extended Abstract (generalization to new contexts)
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
