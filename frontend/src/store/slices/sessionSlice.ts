import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Session + block navigation state

interface SessionState {
  currentSessionId: string | null;
  currentBlockIndex: number;
  totalBlocks: number;
}

const initialState: SessionState = {
  currentSessionId: null,
  currentBlockIndex: 0,
  totalBlocks: 0,
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
    },
    setTotalBlocks: (state, action: PayloadAction<number>) => {
      state.totalBlocks = action.payload;
    },
    nextBlock: (state) => {
      if (state.currentBlockIndex < state.totalBlocks - 1) {
        state.currentBlockIndex += 1;
      }
    },
    resetSession: (state) => {
      state.currentSessionId = null;
      state.currentBlockIndex = 0;
      state.totalBlocks = 0;
    },
  },
});

export const {
  setCurrentSession,
  setCurrentBlockIndex,
  setTotalBlocks,
  nextBlock,
  resetSession,
} = sessionSlice.actions;

export default sessionSlice.reducer;
