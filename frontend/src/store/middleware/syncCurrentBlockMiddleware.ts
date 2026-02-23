import { Middleware } from '@reduxjs/toolkit';
import { sessionsApi } from '../api/sessionsApi';

/** Sync currentBlockIndex to backend when setCurrentBlockIndex is dispatched. */
type SessionAction = { type: string; payload?: number };
export const syncCurrentBlockMiddleware: Middleware = (storeApi) => (next) => (action: unknown) => {
  const result = next(action);
  const a = action as SessionAction;
  if (a.type === 'session/resetSession') {
    return result;
  }
  if (a.type === 'session/setCurrentBlockIndex') {
    const state = storeApi.getState();
    const { currentSessionId } = state.session;
    const newIndex = a.payload as number;

    if (currentSessionId) {
      void storeApi.dispatch(
        sessionsApi.endpoints.updateCurrentBlockIndex.initiate({
          sessionId: currentSessionId,
          currentBlockIndex: newIndex,
        }) as never
      );
    }
  }

  return result;
};
