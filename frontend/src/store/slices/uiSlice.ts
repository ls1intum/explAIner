import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ToastType = "success" | "error" | "info" | "warning";
export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface UiState {
  isLoading: boolean;
  toasts: Toast[];
}
const initialState: UiState = {
  isLoading: false,
  toasts: [],
};

/** 
 * Redux store "ui" slice (Loading Screen, Toasts)
 */
export const uiSlice = createSlice({
  name: "ui",
  initialState,
  // reducers = update the ui state slice based on the given action
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    addToast: (
      state,
      action: PayloadAction<{ message: string; type: ToastType }>
    ) => {
      const id = Date.now().toString();
      state.toasts.push({
        id,
        message: action.payload.message,
        type: action.payload.type,
      });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
  },
});

// export all possible actions that can be dispatched to update the ui state slice
export const { setLoading, addToast, removeToast } = uiSlice.actions;
export default uiSlice.reducer;
