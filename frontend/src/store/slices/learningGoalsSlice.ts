import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { LearningGoalPageData } from "@/types/learning-goals.types";

// Learning goals state for session setup

interface LearningGoalsState {
  pageData: LearningGoalPageData | null;
}

const initialState: LearningGoalsState = {
  pageData: null,
};

export const learningGoalsSlice = createSlice({
  name: "learningGoals",
  initialState,
  reducers: {
    // Set the learning goals page data (topic, keywords, and generated goals)
    setLearningGoalsPageData: (
      state,
      action: PayloadAction<LearningGoalPageData>
    ) => {
      state.pageData = action.payload;
    },
    // Clear the learning goals page data
    clearLearningGoalsPageData: (state) => {
      state.pageData = null;
    },
  },
});

export const { setLearningGoalsPageData, clearLearningGoalsPageData } =
  learningGoalsSlice.actions;

export default learningGoalsSlice.reducer;
