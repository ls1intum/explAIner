'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setCurrentBlockIndex, addBlockToQueue, setTotalBlocks, setCurrentSession, setBlockQueue } from '@/store/slices/sessionSlice';
import { setLoading } from '@/store/slices/uiSlice';
import { setLearningGoalsPageData } from '@/store/slices/learningGoalsSlice';
import { useGetSessionQuery, useGetBlockByOrderIndexQuery, useContinueSessionMutation, useGenerateNextSequenceMutation, useGenerateSummaryMutation } from '@/store/api/sessionsApi';
import { useGenerateEasierLearningGoalsMutation } from '@/store/api/learningGoalsApi';
import LoadingScreen from '@/components/layout/LoadingScreen';
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
  const { currentSessionId, currentBlockIndex, blockQueue, totalBlocks } = useAppSelector(
    (state) => state.session
  );
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

  // API hooks
  const [continueSession] = useContinueSessionMutation();
  const [generateNextSequence, { isLoading: isGeneratingSequence }] = useGenerateNextSequenceMutation();
  const [generateSummary, { isLoading: isGeneratingSummary }] = useGenerateSummaryMutation();
  const [generateEasierLearningGoals, { isLoading: isGeneratingEasierGoals }] = useGenerateEasierLearningGoalsMutation();

  // Fetch session data if Redux is empty (page reload/direct URL navigation)
  const needsSessionData = !currentSessionId || currentSessionId !== sessionId;
  // Only fetch if session data is needed
  const shouldSkip = !needsSessionData;
  const { data: sessionData, isLoading: isLoadingSession } = useGetSessionQuery(
    sessionId,
    { skip: shouldSkip }
  );

  // Hydrate Redux store when session data is fetched
  useEffect(() => {
    if (sessionData && needsSessionData) {
      dispatch(setCurrentSession(sessionData.session.id));
      dispatch(setCurrentBlockIndex(sessionData.session.currentBlockIndex));
      dispatch(setTotalBlocks(sessionData.session.totalBlocks));
      // Use database alreadyViewed values directly
      dispatch(setBlockQueue(sessionData.blocks));
    }
  }, [sessionData, needsSessionData, dispatch]);

  // Check if block already exists in queue to avoid race condition
  // Skip fetch if block is already available (just created via mutation)
  const blockExistsInQueue = blockQueue[currentBlockIndex] !== undefined;

  // Fetch block from API only if not in queue (e.g., direct URL navigation or page refresh)
  const { data: fetchedBlock, isLoading: isBlockLoading } = useGetBlockByOrderIndexQuery(
    { sessionId, orderIndex: currentBlockIndex },
    { skip: currentSessionId !== sessionId || blockExistsInQueue }
  );

  // Use fetched block or fallback to block queue
  const displayBlock = fetchedBlock || blockQueue[currentBlockIndex];

  // Redirect if no session data (only after trying to fetch)
  useEffect(() => {
    // Don't redirect while loading session data
    if (isLoadingSession) return;
    
    // Don't redirect if we have session data being hydrated
    if (sessionData && needsSessionData) return;
    
    // Redirect if still no session after fetch attempt
    if (!currentSessionId || currentSessionId !== sessionId) {
      router.push('/');
    }
  }, [currentSessionId, sessionId, router, isLoadingSession, sessionData, needsSessionData]);
  
  // Manage loading state
  useEffect(() => {
    if (!displayBlock || isBlockLoading) {
      dispatch(setLoading(true));
    } else {
      dispatch(setLoading(false));
    }
  }, [displayBlock, isBlockLoading, dispatch]);

  // Handle generating next sequence
  const handleGenerateNextSequence = async () => {
    try {
      const result = await generateNextSequence({ sessionId }).unwrap();
      
      // Add new blocks to queue
      dispatch(addBlockToQueue(result.informBlock));
      result.practiceBlocks.forEach((block) => {
        dispatch(addBlockToQueue(block));
      });
      
      // Update total blocks
      dispatch(setTotalBlocks(totalBlocks + 4));
      
      // Navigate to the new inform block
      dispatch(setCurrentBlockIndex(result.informBlock.orderIndex));
    } catch (error) {
      console.error('Failed to generate next sequence:', error);
      alert('Failed to generate next sequence. Please try again.');
    }
  };

  // Handle generating summary
  const handleGenerateSummary = async () => {
    try {
      const result = await generateSummary({ sessionId }).unwrap();
      
      // Store summary data
      setSummaryData(result);
      
      // Add summary block to queue
      dispatch(addBlockToQueue(result.block));
      
      // Update total blocks
      dispatch(setTotalBlocks(totalBlocks + 1));
      
      // Navigate to summary block
      dispatch(setCurrentBlockIndex(result.block.orderIndex));
    } catch (error) {
      console.error('Failed to generate summary:', error);
      alert('Failed to generate summary. Please try again.');
    }
  };

  // Handle block navigation via continue endpoint
  const handleContinue = async () => {
    try {
      const response = await continueSession({ sessionId }).unwrap();

      switch (response.action) {
        case 'navigate':
          // Navigate to next block in current sequence
          if (response.nextOrderIndex !== undefined) {
            dispatch(setCurrentBlockIndex(response.nextOrderIndex));
          }
          break;

        case 'next-sequence':
          // Generate next block sequence
          await handleGenerateNextSequence();
          break;

        case 'summary':
          // Generate summary block
          await handleGenerateSummary();
          break;

        case 'prompt-user':
          // Show dialog asking user to choose between easier goal or continue
          setShowPromptDialog(true);
          break;

        default:
          console.error('Unknown action:', response.action);
      }
    } catch (error) {
      console.error('Failed to continue session:', error);
      // Show error to user
      alert('Failed to continue. Please try again.');
    }
  };

  // Handle user choice for prompt dialog
  const handleEasierGoal = async () => {
    setShowPromptDialog(false);
    
    try {
      // Show loading state
      dispatch(setLoading(true));
      
      // Generate easier learning goals based on session
      const result = await generateEasierLearningGoals({ sessionId }).unwrap();
      
      // Set learning goals page data with easier goals
      dispatch(setLearningGoalsPageData({
        topic: result.topic,
        keywords: result.priorKnowledgeKeywords || '',
        goals: result.learningGoals,
      }));
      
      // Navigate to learning goal page
      router.push('/learning-goal');
    } catch (error) {
      console.error('Failed to generate easier learning goals:', error);
      dispatch(setLoading(false));
      alert('Failed to generate easier learning goals. Please try again.');
    }
  };

  const handleContinueWithCurrentGoal = async () => {
    setShowPromptDialog(false);
    // Generate next sequence
    await handleGenerateNextSequence();
  };

  if (!displayBlock || isLoadingSession || isBlockLoading || isGeneratingSequence || isGeneratingSummary || isGeneratingEasierGoals) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <main className="container mx-auto px-4 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        {/* Block Display */}
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
          {displayBlock.type === BlockType.SUMMARY && summaryData && (
            <SummaryBlock
              block={displayBlock}
              sessionInfo={summaryData.sessionInfo}
            />
          )}
        </BlockContainer>
      </main>

      {/* Prompt User Dialog */}
      <GoalAdjustmentDialog
        isOpen={showPromptDialog}
        onContinueWithCurrentGoal={handleContinueWithCurrentGoal}
        onAdjustGoal={handleEasierGoal}
      />
    </div>
  );
}
