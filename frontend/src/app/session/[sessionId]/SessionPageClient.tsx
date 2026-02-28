'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setCurrentBlockIndex, setSessionId, setHighestAlreadyViewedBlockIndex, setTopic, setPriorKnowledge, setLearningGoals } from '@/store/slices/sessionSlice';
import { setLoading, addToast } from '@/store/slices/uiSlice';
import { useGetSessionQuery, useContinueSessionMutation, useUpdateCurrentBlockIndexMutation } from '@/store/api/sessionsApi';
import { useGetBlockQuery, useGenerateBlockSequenceMutation, useGenerateSummaryBlockMutation } from '@/store/api/blocksApi';
import { useGenerateEasierLearningGoalsMutation } from '@/store/api/learningGoalsApi';
import LoadingScreen from '@/components/shared/ui/LoadingScreen';
import InformBlock from '@/components/blocks/InformBlock/InformBlock';
import PracticeBlock from '@/components/blocks/PracticeBlock/PracticeBlock';
import SummaryBlock from '@/components/blocks/SummaryBlock/SummaryBlock';
import EasierLearningGoalDialog from '@/components/session/dialogs/EasierLearningGoalDialog';
import type { Block } from '@/types/domain/block.types';
import { BLOCK_TYPE } from '@/types/domain/enums';

interface SessionPageClientProps {
  sessionId: string;
}

export default function SessionPageClient({ sessionId }: SessionPageClientProps) {

  // Navigation
  const router = useRouter();

  // Redux store hooks
  const dispatch = useAppDispatch();
  const { sessionId: sessionIdFromState, currentBlockIndex } = useAppSelector((state) => state.session);

  // API call hooks
  const { data: sessionData, isLoading: isLoadingSession } = useGetSessionQuery(
    { sessionId },
    { skip: false }
  );
  const [continueSession] = useContinueSessionMutation();
  const [updateCurrentBlockIndex] = useUpdateCurrentBlockIndexMutation();
  const [generateBlockSequence, { isLoading: isGeneratingSequence }] = useGenerateBlockSequenceMutation();
  const [generateSummaryBlock, { isLoading: isGeneratingSummary }] = useGenerateSummaryBlockMutation();
  const [generateEasierLearningGoals, { isLoading: isGeneratingEasierGoals }] = useGenerateEasierLearningGoalsMutation();

  // Init & sync component state
  const [showHowToContinueSessionDialog, setShowHowToContinueSessionDialog] = useState(false);
  const [summaryData, setSummaryData] = useState<{
    block: Block;
    sessionInfo: {
      learningGoal: string;
      bloomsLevel: string;
      totalBlocks: number;
      sessionDuration: number;
    };
  } | null>(null);

  // Hydrate Redux from sessionData when it arrives (or when refetch returns after generate)
  useEffect(() => {
    if (!sessionData || sessionData.id !== sessionId) return;
    dispatch(setSessionId(sessionData.id));
    if (sessionIdFromState !== sessionId) {
      const blocks = sessionData.blocks ?? [];
      const maxFromServer = blocks.filter((b: Block) => b.alreadyViewed).reduce((max: number, b: Block) => Math.max(max, b.orderIndex), 0);
      dispatch(setHighestAlreadyViewedBlockIndex(maxFromServer));
      dispatch(setCurrentBlockIndex(sessionData.currentBlockIndex));
    }
  }, [sessionData, sessionId, sessionIdFromState, dispatch]);

  // Get block data for the current block index
  const { data: blockResponse, isLoading: isBlockLoading } = useGetBlockQuery(
    { sessionId, orderIndex: String(currentBlockIndex) },
    { skip: !sessionData }
  );
  const displayBlock = blockResponse?.data;

  // Get summary session info for the current block index
  const summarySessionInfo =
    displayBlock?.type === BLOCK_TYPE.SUMMARY && sessionData
      ? {
          learningGoal: sessionData.learningGoal?.learningGoal ?? '',
          bloomsLevel: sessionData.learningGoal?.bloomsLevel ?? '',
          totalBlocks: sessionData.totalBlocks ?? 0,
          sessionDuration: summaryData?.sessionInfo.sessionDuration ?? 0,
        }
      : null;

  // Redirect to landing page if session data is not found
  useEffect(() => {
    if (isLoadingSession) return;
    if (!sessionData && sessionId) {
      router.push('/');
    }
  }, [sessionData, sessionId, router, isLoadingSession]);

  // Show loading screen while loading block data
  useEffect(() => {
    if (!displayBlock || isBlockLoading) {
      dispatch(setLoading(true));
    } else {
      dispatch(setLoading(false));
    }
  }, [displayBlock, isBlockLoading, dispatch]);

  // "Continue" button is clicked and action is "next-sequence"
  const handleGenerateNextSequence = async () => {
    try {
      const result = await generateBlockSequence({ sessionId }).unwrap();
      const newIndex = result.informBlock.orderIndex;
      dispatch(setCurrentBlockIndex(newIndex));
      await updateCurrentBlockIndex({ sessionId, currentBlockIndex: newIndex }).unwrap();
    } catch (error) {
      console.error('Failed to generate next sequence:', error);
      dispatch(addToast({ message: 'Failed to generate next sequence. Please try again.', type: 'error' }));
    }
  };

  // "Continue" button is clicked and action is "summary"
  const handleGenerateSummary = async () => {
    try {
      const result = await generateSummaryBlock({ sessionId }).unwrap();
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
      await updateCurrentBlockIndex({ sessionId, currentBlockIndex: newIndex }).unwrap();
    } catch (error) {
      console.error('Failed to generate summary:', error);
      dispatch(addToast({ message: 'Failed to generate summary. Please try again.', type: 'error' }));
    }
  };

  // "Continue" button is clicked and next action is determined (either "navigate", "next-sequence", "summary", or "prompt-user")
  const handleContinue = async () => {
    try {
      const response = await continueSession({ sessionId }).unwrap();

      switch (response.action) {
        case 'navigate':
          if (response.targetBlockIndex !== undefined) {
            dispatch(setCurrentBlockIndex(response.targetBlockIndex));
            await updateCurrentBlockIndex({ sessionId, currentBlockIndex: response.targetBlockIndex }).unwrap();
          }
          break;
        case 'next-sequence':
          await handleGenerateNextSequence();
          break;
        case 'summary':
          await handleGenerateSummary();
          break;
        case 'prompt-user':
          setShowHowToContinueSessionDialog(true);
          break;
        default:
          console.error('Unknown action:', response.action);
      }
    } catch (error) {
      console.error('Failed to continue session:', error);
      dispatch(addToast({ message: 'Failed to continue. Please try again.', type: 'error' }));
    }
  };


  /** How to Continue Session Dialog Handlers 
   * (A) "Adjust Learning Goal" button 
   * (B) "Continue with current Goal" button
  */
  // (A) "Adjust Learning Goal" button is clicked (generates easier learning goals and navigates to learning goal page to start a new session)
  const handleStartNewSessionWithEasierLearningGoal = async () => {
    setShowHowToContinueSessionDialog(false);
    try {
      dispatch(setLoading(true));
      const result = await generateEasierLearningGoals({ sessionId }).unwrap();
      dispatch(setTopic(result.topic));
      dispatch(setPriorKnowledge(result.priorKnowledge ?? ''));
      dispatch(setLearningGoals(result.learningGoals));
      router.push('/learning-goal');
    } catch (error) {
      console.error('Failed to generate easier learning goals:', error);
      dispatch(setLoading(false));
      dispatch(addToast({ message: 'Failed to generate easier learning goals. Please try again.', type: 'error' }));
    }
  };
  // (B) "Continue with Current Goal" button is clicked (generates next sequence and navigates to next block)
  const handleContinueWithCurrentSession = async () => {
    setShowHowToContinueSessionDialog(false);
    await handleGenerateNextSequence();
  };

  const showLoading =
    isLoadingSession ||
    !displayBlock ||
    isBlockLoading ||
    isGeneratingSequence ||
    isGeneratingSummary ||
    isGeneratingEasierGoals;

  // Show loading screen while loading session data, block data, or generating next sequence, summary, or easier learning goals
  if (showLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <main className="container mx-auto px-4 flex items-center justify-center min-h-[calc(100vh-4rem)]">

        {/* Display Block based on block type */}
        <div className="w-full">

          {/* INFORM block */}
          {displayBlock.type === BLOCK_TYPE.INFORM && (
            <InformBlock
              block={displayBlock}
              sessionId={sessionId}
              onContinue={handleContinue}
            />
          )}
          {/* PRACTICE block */}
          {displayBlock.type === BLOCK_TYPE.PRACTICE && (
            <PracticeBlock
              block={displayBlock}
              sessionId={sessionId}
              onContinue={handleContinue}
            />
          )}
          {/* SUMMARY block */}
          {displayBlock.type === BLOCK_TYPE.SUMMARY && summarySessionInfo && (
            <SummaryBlock
              block={displayBlock}
              sessionInfo={summarySessionInfo}
            />
          )}
        </div>
      </main>

      {/* How to Continue Session Dialog */}
      <EasierLearningGoalDialog
        isOpen={showHowToContinueSessionDialog}
        onContinueWithCurrentSession={handleContinueWithCurrentSession}
        onStartNewSessionWithEasierLearningGoal={handleStartNewSessionWithEasierLearningGoal}
      />
    </div>
  );
}
