import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { LearningGoal } from "@/types/domain/learning-goals.types";

interface SessionState {
  topic: string;
  priorKnowledge: string;
  learningGoals: LearningGoal[] | null;
  sessionId: string | null;
  currentBlockIndex: number; // block index of block currently being viewed by the client (synced to server via updateCurrentBlockIndex, hydrated from getSession)
  highestAlreadyViewedBlockIndex: number; // highest block index ever viewed by the client (necessary to show/hide the already viewed / not yet viewed block chips in the navbar which allow to navigate between blocks; hydrated from blocks.alreadyViewed)
}

const initialState: SessionState = {
  topic: "",
  priorKnowledge: "",
  learningGoals: null,
  sessionId: null,
  currentBlockIndex: 0,
  highestAlreadyViewedBlockIndex: 0,
};

/** 
 * Redux store "session" slice 
 */
export const sessionSlice = createSlice({
  name: "session",
  initialState,
  // reducers: update the session state slice based on the given action
  reducers: {
    setTopic: (state, action: PayloadAction<string>) => {
      state.topic = action.payload;
    },
    setPriorKnowledge: (state, action: PayloadAction<string>) => {
      state.priorKnowledge = action.payload;
    },
    setLearningGoals: (state, action: PayloadAction<LearningGoal[] | null>) => {
      state.learningGoals = action.payload;
    },
    setSessionId: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload;
    },
    setCurrentBlockIndex: (state, action: PayloadAction<number>) => {
      state.currentBlockIndex = action.payload;
      state.highestAlreadyViewedBlockIndex = Math.max(state.highestAlreadyViewedBlockIndex, action.payload);
    },
    setHighestAlreadyViewedBlockIndex: (state, action: PayloadAction<number>) => {
      state.highestAlreadyViewedBlockIndex = action.payload;
    },
    resetSession: (state) => {
      state.topic = "";
      state.priorKnowledge = "";
      state.learningGoals = null;
      state.sessionId = null;
      state.currentBlockIndex = 0;
      state.highestAlreadyViewedBlockIndex = 0;
    },
    clearSessionCreationData: (state) => {
      state.topic = "";
      state.priorKnowledge = "";
      state.learningGoals = null;
    },
  },
});

// export all possible actions that can be dispatched to update the session state slice
export const {
  setTopic,
  setPriorKnowledge,
  setLearningGoals,
  setSessionId,
  setCurrentBlockIndex,
  setHighestAlreadyViewedBlockIndex,
  resetSession,
  clearSessionCreationData,
} = sessionSlice.actions;
export default sessionSlice.reducer;
