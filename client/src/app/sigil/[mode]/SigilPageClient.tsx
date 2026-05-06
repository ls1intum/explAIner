'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setCurrentBlockIndex, setSessionId, setHighestAlreadyViewedBlockIndex } from '@/store/slices/sessionSlice';
import { addToast } from '@/store/slices/uiSlice';
import { useGetSessionQuery, useUpdateCurrentBlockIndexMutation } from '@/store/api/sessionsApi';
import { useGetBlockQuery, useGenerateSummaryBlockMutation } from '@/store/api/blocksApi';
import {
  useCreateSigilSessionMutation,
  useContinueSigilSessionMutation,
  useGenerateSigilBlockSequenceMutation,
} from '@/store/api/sigilApi';
import LoadingScreen from '@/components/shared/ui/LoadingScreen';
import InformBlock from '@/components/blocks/InformBlock/InformBlock';
import PracticeBlock from '@/components/blocks/PracticeBlock/PracticeBlock';
import SummaryBlock from '@/components/blocks/SummaryBlock/SummaryBlock';
import type { Block } from '@/types/domain/block.types';
import { BLOCK_TYPE } from '@/types/domain/enums';

type SigilMode = 'elements' | 'details' | 'analysis' | 'chat';

interface SigilPageClientProps {
  mode: SigilMode;
  lang: 'de' | 'en';
  existingSessionId: string | null;
}

export default function SigilPageClient({ mode, lang, existingSessionId }: SigilPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { sessionId: sessionIdFromState, currentBlockIndex } = useAppSelector((state) => state.session);

  const [activeSessionId, setActiveSessionId] = useState<string | null>(existingSessionId);
  const [practiceReady, setPracticeReady] = useState(false);
  const creatingRef = useRef(false);

  const [createSigilSession] = useCreateSigilSessionMutation();
  const [continueSigilSession] = useContinueSigilSessionMutation();
  const [generateSigilBlockSequence, { isLoading: isGeneratingSequence }] = useGenerateSigilBlockSequenceMutation();
  const [generateSummaryBlock, { isLoading: isGeneratingSummary }] = useGenerateSummaryBlockMutation();
  const [updateCurrentBlockIndex] = useUpdateCurrentBlockIndexMutation();

  const { data: sessionData, isLoading: isLoadingSession } = useGetSessionQuery(
    { sessionId: activeSessionId! },
    { skip: !activeSessionId, pollingInterval: !practiceReady && mode !== 'chat' ? 3000 : 0 }
  );

  const { data: blockResponse, isLoading: isBlockLoading } = useGetBlockQuery(
    { sessionId: activeSessionId!, orderIndex: String(currentBlockIndex) },
    { skip: !activeSessionId || !sessionData }
  );

  // Detect when practice blocks are ready (totalBlocks > 1 means async generation completed)
  useEffect(() => {
    if (sessionData && (sessionData.totalBlocks > 1 || mode === 'chat')) {
      setPracticeReady(true);
    }
  }, [sessionData, mode]);

  // Create session on mount if no existing session
  useEffect(() => {
    if (activeSessionId || creatingRef.current) return;
    creatingRef.current = true;

    const create = async () => {
      try {
        const result = await createSigilSession({ mode, lang }).unwrap();
        const newSessionId = result.sessionId;
        setActiveSessionId(newSessionId);
        dispatch(setSessionId(newSessionId));
        dispatch(setCurrentBlockIndex(0));
        dispatch(setHighestAlreadyViewedBlockIndex(0));

        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set('session', newSessionId);
        router.replace(`/sigil/${mode}?${newParams.toString()}`);
      } catch (error) {
        console.error('Failed to create sigil session:', error);
        dispatch(addToast({ message: 'Failed to create session. Please reload.', type: 'error' }));
        creatingRef.current = false;
      }
    };

    create();
  }, [activeSessionId, mode, lang, createSigilSession, dispatch, router, searchParams]);

  // Hydrate Redux from session data
  useEffect(() => {
    if (!sessionData || !activeSessionId) return;
    if (sessionData.id !== activeSessionId) return;

    dispatch(setSessionId(sessionData.id));
    if (sessionIdFromState !== activeSessionId) {
      const blocks = sessionData.blocks ?? [];
      const maxFromServer = blocks
        .filter((b: Block) => b.alreadyViewed)
        .reduce((max: number, b: Block) => Math.max(max, b.orderIndex), 0);
      dispatch(setHighestAlreadyViewedBlockIndex(maxFromServer));
      dispatch(setCurrentBlockIndex(sessionData.currentBlockIndex));
    }
  }, [sessionData, activeSessionId, sessionIdFromState, dispatch]);

  const displayBlock = blockResponse?.data;

  const [summaryData, setSummaryData] = useState<{
    block: Block;
    sessionInfo: {
      learningGoal: string;
      bloomsLevel: string;
      totalBlocks: number;
      sessionDuration: number;
    };
  } | null>(null);

  const summarySessionInfo =
    displayBlock?.type === BLOCK_TYPE.SUMMARY && sessionData
      ? {
          learningGoal: sessionData.learningGoal?.learningGoal ?? '',
          bloomsLevel: sessionData.learningGoal?.bloomsLevel ?? '',
          totalBlocks: sessionData.totalBlocks ?? 0,
          sessionDuration: summaryData?.sessionInfo.sessionDuration ?? 0,
        }
      : null;

  const handleGenerateNextSequence = useCallback(async () => {
    if (!activeSessionId) return;
    try {
      const result = await generateSigilBlockSequence({ sessionId: activeSessionId, lang }).unwrap();
      const newIndex = result.informBlock.orderIndex;
      dispatch(setCurrentBlockIndex(newIndex));
      await updateCurrentBlockIndex({ sessionId: activeSessionId, currentBlockIndex: newIndex }).unwrap();
    } catch (error) {
      console.error('Failed to generate next sequence:', error);
      dispatch(addToast({ message: 'Failed to generate next sequence. Please try again.', type: 'error' }));
    }
  }, [activeSessionId, lang, generateSigilBlockSequence, dispatch, updateCurrentBlockIndex]);

  const handleGenerateSummary = useCallback(async () => {
    if (!activeSessionId) return;
    try {
      const result = await generateSummaryBlock({ sessionId: activeSessionId }).unwrap();
      const block = result as Block;
      const newIndex = result.orderIndex;
      setSummaryData({
        block,
        sessionInfo: {
          learningGoal: sessionData?.learningGoal?.learningGoal ?? '',
          bloomsLevel: sessionData?.learningGoal?.bloomsLevel ?? '',
          totalBlocks: result.totalBlocks,
          sessionDuration: result.sessionDuration,
        },
      });
      dispatch(setCurrentBlockIndex(newIndex));
      await updateCurrentBlockIndex({ sessionId: activeSessionId, currentBlockIndex: newIndex }).unwrap();
    } catch (error) {
      console.error('Failed to generate summary:', error);
      dispatch(addToast({ message: 'Failed to generate summary. Please try again.', type: 'error' }));
    }
  }, [activeSessionId, generateSummaryBlock, sessionData, dispatch, updateCurrentBlockIndex]);

  const handleContinue = useCallback(async () => {
    if (!activeSessionId) return;

    try {
      const response = await continueSigilSession({ sessionId: activeSessionId }).unwrap();

      switch (response.action) {
        case 'navigate':
          if (response.targetBlockIndex !== undefined) {
            dispatch(setCurrentBlockIndex(response.targetBlockIndex));
            await updateCurrentBlockIndex({
              sessionId: activeSessionId,
              currentBlockIndex: response.targetBlockIndex,
            }).unwrap();
          }
          break;
        case 'next-sequence':
          await handleGenerateNextSequence();
          break;
        case 'summary':
          await handleGenerateSummary();
          break;
        default:
          console.error('Unknown action:', response.action);
      }
    } catch (error) {
      console.error('Failed to continue session:', error);
      dispatch(addToast({ message: 'Failed to continue. Please try again.', type: 'error' }));
    }
  }, [activeSessionId, continueSigilSession, dispatch, updateCurrentBlockIndex, handleGenerateNextSequence, handleGenerateSummary]);

  const isChatMode = mode === 'chat';
  const showContinueButton = !isChatMode && practiceReady;

  const isLoading =
    !activeSessionId ||
    isLoadingSession ||
    !displayBlock ||
    isBlockLoading ||
    isGeneratingSequence ||
    isGeneratingSummary;

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 flex items-center justify-center min-h-screen">
        <div className="w-full">

          {displayBlock.type === BLOCK_TYPE.INFORM && (
            <InformBlock
              block={displayBlock}
              sessionId={activeSessionId!}
              onContinue={handleContinue}
              hideContinueButton={!showContinueButton}
            />
          )}

          {displayBlock.type === BLOCK_TYPE.PRACTICE && (
            <PracticeBlock
              block={displayBlock}
              sessionId={activeSessionId!}
              onContinue={handleContinue}
            />
          )}

          {displayBlock.type === BLOCK_TYPE.SUMMARY && summarySessionInfo && (
            <SummaryBlock
              block={displayBlock}
              sessionInfo={summarySessionInfo}
            />
          )}
        </div>
      </main>
    </div>
  );
}
