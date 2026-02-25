import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// UI state: which block is selected (hydrated from getSession; synced to server via updateCurrentBlockIndex)

interface SessionState {
  currentSessionId: string | null;
  currentBlockIndex: number;
}

const initialState: SessionState = {
  currentSessionId: null,
  currentBlockIndex: 0,
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
    resetSession: (state) => {
      state.currentSessionId = null;
      state.currentBlockIndex = 0;
    },
  },
});

export const { setCurrentSession, setCurrentBlockIndex, resetSession } = sessionSlice.actions;
export default sessionSlice.reducer;
