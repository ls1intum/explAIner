/**
 * Page Data Types
 * 
 * Frontend-only types for passing data between pages and managing UI state.
 * These are NOT part of the API contract.
 */

import type { LearningGoal } from '../domain';

/**
 * Learning Goal Page Data
 * 
 * Data structure for passing learning goal information between pages
 * (e.g., from learning-goal page to session creation).
 */
export interface LearningGoalPageData {
  topic: string;
  keywords?: string;
  goals: LearningGoal[];
}
