import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCurrentSession, nextBlock, resetSession } from "@/store/slices/sessionSlice";

// Session orchestration (create, navigate)

export function useSession() {
  const dispatch = useAppDispatch();
  const { currentSessionId, currentBlockIndex, totalBlocks } = useAppSelector(
    (state) => state.session
  );

  const startSession = useCallback((sessionId: string) => {
    dispatch(setCurrentSession(sessionId));
  }, [dispatch]);

  const goToNextBlock = useCallback(() => {
    dispatch(nextBlock());
  }, [dispatch]);

  const endSession = useCallback(() => {
    dispatch(resetSession());
  }, [dispatch]);

  return {
    currentSessionId,
    currentBlockIndex,
    totalBlocks,
    startSession,
    goToNextBlock,
    endSession,
  };
}
