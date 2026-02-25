import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// UI state: which block is selected (hydrated from getSession; synced to server via updateCurrentBlockIndex)
// highestAlreadyViewedBlockIndex = highest block index ever opened (for navbar chips when navigating back; hydrated from blocks.alreadyViewed)

interface SessionState {
  currentSessionId: string | null;
  currentBlockIndex: number;
  highestAlreadyViewedBlockIndex: number;
}

const initialState: SessionState = {
  currentSessionId: null,
  currentBlockIndex: 0,
  highestAlreadyViewedBlockIndex: 0,
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setCurrentSession: (state, action: PayloadAction<string>) => {
      state.currentSessionId = action.payload;
    },
    setCurrentBlockIndex: (state, action: PayloadAction<number>) => {
      state.currentBlockIndex = action.payload;
      state.highestAlreadyViewedBlockIndex = Math.max(state.highestAlreadyViewedBlockIndex, action.payload);
    },
    setHighestAlreadyViewedBlockIndex: (state, action: PayloadAction<number>) => {
      state.highestAlreadyViewedBlockIndex = action.payload;
    },
    resetSession: (state) => {
      state.currentSessionId = null;
      state.currentBlockIndex = 0;
      state.highestAlreadyViewedBlockIndex = 0;
    },
  },
});

export const { setCurrentSession, setCurrentBlockIndex, setHighestAlreadyViewedBlockIndex, resetSession } = sessionSlice.actions;
export default sessionSlice.reducer;
