import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import { loggingMiddleware } from "./middleware/loggingMiddleware";
import sessionReducer from "./slices/sessionSlice";
import learningGoalsReducer from "./slices/learningGoalsSlice";
import uiReducer from "./slices/uiSlice";

/** 
 * Redux store configuration 
 */
export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    session: sessionReducer,
    learningGoals: learningGoalsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(baseApi.middleware)
      .concat(loggingMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
