import { Middleware } from '@reduxjs/toolkit';
import { sessionsApi } from '../api/sessionsApi';
import { RootState } from '../store';

/**
 * Middleware to sync currentBlockIndex to backend
 * Intercepts setCurrentBlockIndex actions and persists to database
 */
export const syncCurrentBlockMiddleware: Middleware<{}, RootState> = (storeApi) => (next) => (action) => {
  // Let the action pass through first
  const result = next(action);

  // Skip sync if we're resetting the session (prevents API call during deletion)
  if (action.type === 'session/resetSession') {
    return result;
  }

  // Check if this is a setCurrentBlockIndex action
  if (action.type === 'session/setCurrentBlockIndex') {
    const state = storeApi.getState();
    const { currentSessionId } = state.session;
    const newIndex = action.payload as number;

    // Only sync if we have a valid session ID
    if (currentSessionId) {
      // Call API to persist (fire and forget - don't block UI)
      storeApi.dispatch(
        sessionsApi.endpoints.updateCurrentBlockIndex.initiate({
          sessionId: currentSessionId,
          currentBlockIndex: newIndex,
        })
      );
    }
  }

  return result;
};
