import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Global UI state

interface UiState {
  isLoading: boolean;
  loadingMessage: string;
  theme: "light" | "dark";
}

const initialState: UiState = {
  isLoading: false,
  loadingMessage: "",
  theme: "light",
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setLoadingMessage: (state, action: PayloadAction<string>) => {
      state.loadingMessage = action.payload;
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
    },
  },
});

export const { setLoading, setLoadingMessage, setTheme } = uiSlice.actions;

export default uiSlice.reducer;
