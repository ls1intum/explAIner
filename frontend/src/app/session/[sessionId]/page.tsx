'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setCurrentBlockIndex, setCurrentSession } from '@/store/slices/sessionSlice';
import { setLoading } from '@/store/slices/uiSlice';
import { setLearningGoalPageData } from '@/store/slices/learningGoalsSlice';
import { useGetSessionQuery, useContinueSessionMutation, useUpdateCurrentBlockIndexMutation } from '@/store/api/sessionsApi';
import { useGetBlockQuery, useGenerateBlockSequenceMutation, useGenerateSummaryBlockMutation } from '@/store/api/blocksApi';
import { useGenerateEasierLearningGoalsMutation } from '@/store/api/learningGoalsApi';
import LoadingScreen from '@/components/ui/LoadingScreen';
import InformBlock from '@/components/blocks/InformBlock/InformBlock';
import PracticeBlock from '@/components/blocks/PracticeBlock/PracticeBlock';
import SummaryBlock from '@/components/blocks/SummaryBlock/SummaryBlock';
import BlockContainer from '@/components/blocks/BlockContainer';
import GoalAdjustmentDialog from '@/components/session/GoalAdjustmentDialog';
import { BlockType } from '@/types/domain';
import type { Block } from '@/types/domain';

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const sessionId = params.sessionId as string;
  const { currentSessionId, currentBlockIndex } = useAppSelector((state) => state.session);
  const [showPromptDialog, setShowPromptDialog] = useState(false);
  const [summaryData, setSummaryData] = useState<{
    block: Block;
    sessionInfo: {
      learningGoal: string;
      bloomsLevel: string;
      totalBlocks: number;
      sessionDuration: number;
    };
  } | null>(null);

  const [continueSession] = useContinueSessionMutation();
  const [updateCurrentBlockIndex] = useUpdateCurrentBlockIndexMutation();
  const [generateBlockSequence, { isLoading: isGeneratingSequence }] = useGenerateBlockSequenceMutation();
  const [generateSummaryBlock, { isLoading: isGeneratingSummary }] = useGenerateSummaryBlockMutation();
  const [generateEasierLearningGoals, { isLoading: isGeneratingEasierGoals }] = useGenerateEasierLearningGoalsMutation();

  // Session: block list + metadata; hydrate currentBlockIndex only on initial load (so refetch after generate doesn't overwrite)
  const { data: sessionData, isLoading: isLoadingSession } = useGetSessionQuery({ sessionId });

  useEffect(() => {
    if (!sessionData || sessionData.id !== sessionId) return;
    dispatch(setCurrentSession(sessionData.id));
    // Only hydrate currentBlockIndex on initial load/reload so refetch after generate doesn't overwrite
    if (currentSessionId !== sessionId) {
      dispatch(setCurrentBlockIndex(sessionData.currentBlockIndex));
    }
  }, [sessionData, sessionId, currentSessionId, dispatch]);

  // Current block content from getBlock only (no full session refetch on navigate)
  const { data: blockResponse, isLoading: isBlockLoading } = useGetBlockQuery(
    { sessionId, orderIndex: String(currentBlockIndex) },
    { skip: !sessionData }
  );
  const displayBlock = blockResponse?.data;

  // SessionInfo for summary block: from sessionData; duration from just-generated response (0 on reload, getSession doesn't return it)
  const summarySessionInfo =
    displayBlock?.type === BlockType.SUMMARY && sessionData
      ? {
          learningGoal: sessionData.learningGoal?.learningGoal ?? '',
          bloomsLevel: sessionData.learningGoal?.bloomsLevel ?? '',
          totalBlocks: sessionData.totalBlocks ?? 0,
          sessionDuration: summaryData?.sessionInfo.sessionDuration ?? 0,
        }
      : null;

  // Redirect when session not found or invalid
  useEffect(() => {
    if (isLoadingSession) return;
    if (!sessionData && sessionId) {
      router.push('/');
    }
  }, [sessionData, sessionId, router, isLoadingSession]);

  useEffect(() => {
    if (!displayBlock || isBlockLoading) {
      dispatch(setLoading(true));
    } else {
      dispatch(setLoading(false));
    }
  }, [displayBlock, isBlockLoading, dispatch]);

  const handleGenerateNextSequence = async () => {
    try {
      const result = await generateBlockSequence({ sessionId }).unwrap();
      const newIndex = result.informBlock.orderIndex;
      dispatch(setCurrentBlockIndex(newIndex));
      await updateCurrentBlockIndex({ sessionId, currentBlockIndex: newIndex }).unwrap();
    } catch (error) {
      console.error('Failed to generate next sequence:', error);
      alert('Failed to generate next sequence. Please try again.');
    }
  };

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
      alert('Failed to generate summary. Please try again.');
    }
  };

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
          setShowPromptDialog(true);
          break;
        default:
          console.error('Unknown action:', response.action);
      }
    } catch (error) {
      console.error('Failed to continue session:', error);
      alert('Failed to continue. Please try again.');
    }
  };

  const handleEasierGoal = async () => {
    setShowPromptDialog(false);
    try {
      dispatch(setLoading(true));
      const result = await generateEasierLearningGoals({ sessionId }).unwrap();
      dispatch(setLearningGoalPageData({
        topic: result.topic,
        keywords: result.priorKnowledge || '',
        goals: result.learningGoals,
      }));
      router.push('/learning-goal');
    } catch (error) {
      console.error('Failed to generate easier learning goals:', error);
      dispatch(setLoading(false));
      alert('Failed to generate easier learning goals. Please try again.');
    }
  };

  const handleContinueWithCurrentGoal = async () => {
    setShowPromptDialog(false);
    await handleGenerateNextSequence();
  };

  if (!displayBlock || isLoadingSession || isBlockLoading || isGeneratingSequence || isGeneratingSummary || isGeneratingEasierGoals) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <main className="container mx-auto px-4 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <BlockContainer>
          {displayBlock.type === BlockType.INFORM && (
            <InformBlock
              block={displayBlock}
              sessionId={sessionId}
              onContinue={handleContinue}
            />
          )}
          {displayBlock.type === BlockType.PRACTICE && (
            <PracticeBlock
              block={displayBlock}
              sessionId={sessionId}
              onContinue={handleContinue}
            />
          )}
          {displayBlock.type === BlockType.SUMMARY && summarySessionInfo && (
            <SummaryBlock
              block={displayBlock}
              sessionInfo={summarySessionInfo}
            />
          )}
        </BlockContainer>
      </main>

      <GoalAdjustmentDialog
        isOpen={showPromptDialog}
        onContinueWithCurrentGoal={handleContinueWithCurrentGoal}
        onAdjustGoal={handleEasierGoal}
      />
    </div>
  );
}
