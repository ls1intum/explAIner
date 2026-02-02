import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Toast notification state

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastState {
  toasts: Toast[];
}

const initialState: ToastState = {
  toasts: [],
};

export const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    // Add a new toast
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
    // Remove a toast by ID
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
  },
});

export const { addToast, removeToast } = toastSlice.actions;

export default toastSlice.reducer;
