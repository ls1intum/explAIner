import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { LearningGoal } from "@/types/domain/learning-goals.types";

// Learning goals state for session setup

/** Data passed from learning-goal page to session creation. */
export interface LearningGoalPageData {
  topic: string;
  keywords?: string;
  goals: LearningGoal[];
}

interface LandingPageData {
  topic: string;
  priorKnowledge: string;
}

interface LearningGoalsState {
  landingPageData: LandingPageData;
  learningGoalPageData: LearningGoalPageData | null;
}

const initialState: LearningGoalsState = {
  landingPageData: { topic: "", priorKnowledge: "" },
  learningGoalPageData: null,
};

/** 
 * Redux learning-goal slice 
 */
export const learningGoalsSlice = createSlice({
  name: "learningGoals",
  initialState,
  reducers: {
    setLearningGoalPageData: (
      state,
      action: PayloadAction<LearningGoalPageData>
    ) => {
      state.learningGoalPageData = action.payload;
    },
    clearLearningGoalPageData: (state) => {
      state.learningGoalPageData = null;
    },
    setLandingPageTopic: (state, action: PayloadAction<string>) => {
      state.landingPageData.topic = action.payload;
    },
    setLandingPagePriorKnowledge: (state, action: PayloadAction<string>) => {
      state.landingPageData.priorKnowledge = action.payload;
    },
    clearLandingPageData: (state) => {
      state.landingPageData = { topic: "", priorKnowledge: "" };
    },
  },
});

export const {
  setLearningGoalPageData,
  clearLearningGoalPageData,
  setLandingPageTopic,
  setLandingPagePriorKnowledge,
  clearLandingPageData,
} = learningGoalsSlice.actions;

export default learningGoalsSlice.reducer;
