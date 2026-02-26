import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import sessionReducer from "./slices/sessionSlice";
import uiReducer from "./slices/uiSlice";
import learningGoalsReducer from "./slices/learningGoalsSlice";
import toastReducer from "./slices/toastSlice";
import { loggingMiddleware } from "./middleware/loggingMiddleware";

/** 
 * Redux store configuration 
 */
export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    session: sessionReducer,
    ui: uiReducer,
    learningGoals: learningGoalsReducer,
    toast: toastReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(baseApi.middleware)
      .concat(loggingMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
