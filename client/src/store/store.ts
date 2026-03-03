import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import { loggingMiddleware } from "./middleware/loggingMiddleware";
import sessionReducer from "./slices/sessionSlice";
import uiReducer from "./slices/uiSlice";

/**
 * A brief Redux Overview:
 * 
 * Store:     = single object holding all client state (completely erased on browser reload)
 * Slices:    = divide the redux store into "sections" (called slices) for cleaner separation of concerns
 * Reducers:  = update a state slice based on an action
 * Action:    = triggered by the user in a UI component
 * Hooks:     = enable interaction between UI components and the redux store 
 *              (e.g. useAppDispatch = hook to send an action from the UI component to the store)
 *              (e.g. useAppSelector = hook to re-render UI component after state in the store was updated)
 * 
 * Flow: 
 * (1) user performs some action in UI (e.g. button click)
 * (2) UI component calls dispatch(someAction()) <- making use of hook "useAppDispatch"
 * (3) (optional) middleware runs between dispatch and reducer (e.g. for logging the action)
 * (4) reducer updates the relevant state slice
 * (5) UI component re-renders with new state <- making use of hook "useAppSelector"
 */


/** 
 * Redux store divided into 3 slices: { api, session, ui }
*/
export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    session: sessionReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(baseApi.middleware)
      .concat(loggingMiddleware),
});
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;