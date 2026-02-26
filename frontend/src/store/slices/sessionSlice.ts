import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SessionState {
  currentSessionId: string | null;
  currentBlockIndex: number; // block index of block currently being viewed by the client (synced to server via updateCurrentBlockIndex, hydrated from getSession)
  highestAlreadyViewedBlockIndex: number; // highest block index ever viewed by the client (necessary to show/hide the already viewed / not yet viewed block chips in the navbar which allow to navigate between blocks; hydrated from blocks.alreadyViewed)
}

const initialState: SessionState = {
  currentSessionId: null,
  currentBlockIndex: 0,
  highestAlreadyViewedBlockIndex: 0,
};

/** 
 * Redux session slice 
 */
export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setCurrentSessionId: (state, action: PayloadAction<string>) => {
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

export const { setCurrentSessionId, setCurrentBlockIndex, setHighestAlreadyViewedBlockIndex, resetSession } = sessionSlice.actions;
export default sessionSlice.reducer;
