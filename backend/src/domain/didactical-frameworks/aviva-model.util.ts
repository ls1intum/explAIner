/**
 * AVIVA Model for Learning Session Design
 *
 * AVIVA is a five-stage didactical model that structures effective learning sessions.
 * The model ensures learners progress through essential stages from arrival to assessment.
 *
 * This file provides the AVIVA model description for context in AI prompts.
 */

export const AVIVA_MODEL_DESCRIPTION = `
AVIVA Model - Five-Stage Learning Session Framework:

The AVIVA model structures learning sessions through five progressive stages:

**1. Arrive**
   - Purpose: Engage learner and establish learning context
   - Implementation: Session creation where user enters topic/question
   - Goal: Create readiness and motivation for learning

**2. Prior Knowledge**
   - Purpose: Activate and assess existing knowledge
   - Implementation: Optional prior knowledge keywords input
   - Goal: Connect new learning to existing understanding and avoid redundancy

**3. Inform**
   - Purpose: Present new information and concepts
   - Implementation: INFORM blocks with structured content (explanation, key facts, summary)
   - Goal: Build knowledge foundation through clear instruction
   - Features: Interactive chat for follow-up questions and clarifications

**4. Practice**
   - Purpose: Apply and test understanding
   - Implementation: PRACTICE blocks with multiple-choice questions
   - Goal: Reinforce learning through active retrieval and application
   - Features: Progressive difficulty using SOLO taxonomy

**5. Assess**
   - Purpose: Evaluate learning and provide feedback
   - Implementation: Answer checking, adaptive progression, and SUMMARY block
   - Goal: Confirm mastery and identify areas needing review
   - Features: Adaptive loops for misconception correction

**Key Principles:**
- Each stage builds on the previous one
- The model supports iterative learning (multiple Inform-Practice-Assess cycles)
- Assessment informs subsequent instruction (adaptive learning)
- Prior knowledge integration prevents redundant content
`;
