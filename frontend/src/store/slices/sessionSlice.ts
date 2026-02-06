import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Block } from "@/types/session.types";

// Session + block navigation state

interface SessionState {
  currentSessionId: string | null;
  currentBlockIndex: number;
  totalBlocks: number;
  blockQueue: Block[];
}

const initialState: SessionState = {
  currentSessionId: null,
  currentBlockIndex: 0,
  totalBlocks: 0,
  blockQueue: [],
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setCurrentSession: (state, action: PayloadAction<string>) => {
      state.currentSessionId = action.payload;
    },
    setCurrentBlockIndex: (state, action: PayloadAction<number>) => {
      const newIndex = action.payload;
      state.currentBlockIndex = newIndex;
      // Ensure the block is marked as viewed when navigating to it
      if (state.blockQueue[newIndex]) {
        state.blockQueue[newIndex].alreadyViewed = true;
      }
    },
    setTotalBlocks: (state, action: PayloadAction<number>) => {
      state.totalBlocks = action.payload;
    },
    setBlockQueue: (state, action: PayloadAction<Block[]>) => {
      state.blockQueue = action.payload;
    },
    addBlockToQueue: (state, action: PayloadAction<Block>) => {
      state.blockQueue.push(action.payload);
    },
    // Update practice block answer
    updatePracticeBlockAnswer: (
      state,
      action: PayloadAction<{
        blockId: string;
        studentAnswerOptionIndices: number[];
        studentAnswerIsCorrect: boolean;
      }>
    ) => {
      const block = state.blockQueue.find((b) => b.id === action.payload.blockId);
      if (block?.practiceBlock) {
        block.practiceBlock.studentAnswerOptionIndices = action.payload.studentAnswerOptionIndices;
        block.practiceBlock.studentAnswerIsCorrect = action.payload.studentAnswerIsCorrect;
      }
    },
    // Mark block as viewed
    markBlockAsViewed: (state, action: PayloadAction<number>) => {
      const blockIndex = action.payload;
      if (state.blockQueue[blockIndex]) {
        state.blockQueue[blockIndex].alreadyViewed = true;
      }
    },
    nextBlock: (state) => {
      if (state.currentBlockIndex < state.totalBlocks - 1) {
        // Mark next block as viewed when navigating to it
        const nextIndex = state.currentBlockIndex + 1;
        if (state.blockQueue[nextIndex]) {
          state.blockQueue[nextIndex].alreadyViewed = true;
        }
        state.currentBlockIndex = nextIndex;
      }
    },
    resetSession: (state) => {
      state.currentSessionId = null;
      state.currentBlockIndex = 0;
      state.totalBlocks = 0;
      state.blockQueue = [];
    },
  },
});

export const {
  setCurrentSession,
  setCurrentBlockIndex,
  setTotalBlocks,
  setBlockQueue,
  addBlockToQueue,
  updatePracticeBlockAnswer,
  markBlockAsViewed,
  nextBlock,
  resetSession,
} = sessionSlice.actions;

export default sessionSlice.reducer;
