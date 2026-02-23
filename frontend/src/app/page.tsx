'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RocketIcon } from '@radix-ui/react-icons';
import TopicOrQuestionInput from '@/components/learning-topic/TopicOrQuestionInput';
import PriorKnowledgeKeywordsInput from '@/components/learning-topic/PriorKnowledgeKeywordsInput';
import LoadingScreen from '@/components/layout/LoadingScreen';
import { useGenerateLearningGoalsMutation } from '@/store/api/learningGoalsApi';
import { useAppDispatch } from '@/store/hooks';
import { setLoading } from '@/store/slices/uiSlice';
import { setLearningGoalsPageData } from '@/store/slices/learningGoalsSlice';
import { addToast } from '@/store/slices/toastSlice';

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const hasStartedTyping = topic.length > 0;

  const [generateLearningGoals, { isLoading }] =
    useGenerateLearningGoalsMutation();

  // Update global loading state
  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [isLoading, dispatch]);

  const handleStartSession = async () => {
    try {
      // Call API to generate learning goals
      const result = await generateLearningGoals({
        topic,
        priorKnowledge: keywords.trim() || undefined,
      }).unwrap();

      // Store learning goals data in Redux
      dispatch(
        setLearningGoalsPageData({
          topic,
          keywords,
          goals: result.learningGoals,
        })
      );

      // Navigate to learning goal page with clean URL
      router.push('/learning-goal');
    } catch (err) {
      console.error('Failed to generate learning goals:', err);
      dispatch(
        addToast({
          message: 'Failed to generate learning goals. Please try again.',
          type: 'error',
        })
      );
    }
  };

  // Show loading screen while API call is in progress
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-background">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        {/* Owlbert Character with Speech Bubble */}
        <div className="relative mb-6 flex flex-col items-center mb-10">
          <div className="relative bg-card border-2 border-secondary rounded-2xl px-4 py-2 shadow-sm whitespace-nowrap mb-4">
            <div className="text-xs text-foreground">
              {hasStartedTyping ? 'I can teach you anything!' : 'Hi, I\'m Owlbert ... Owlbert Einstein'}
            </div>
            {/* Arrow pointing down */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-secondary"></div>
          </div>
          
          <div className="flex items-center justify-center">
            <Image
              src={hasStartedTyping ? '/images/owlbert/main.png' : '/images/owlbert/waving.png'}
              alt="Owlbert the Owl"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>
        </div>

        {/* ExplAIner Title - Hidden when typing */}
        {!hasStartedTyping && (
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-5xl font-bold mb-3">
              <span className="text-foreground">Expl</span>
              <span className="text-brand-gradient">AI</span>
              <span className="text-foreground">ner</span>
            </h1>

            {/* Subtitle */}
            <p className="text-2xl font-semibold text-brand-gradient">
              Learn at Your Own Pace
            </p>
          </div>
        )}

        {/* Form Container */}
        <div className="w-full max-w-2xl flex flex-col items-center space-y-6 mt-5">
          {/* Topic Input with Badge Label */}
          <TopicOrQuestionInput value={topic} onChange={setTopic} />

          {/* Optional Keywords Input - Shown when typing */}
          {hasStartedTyping && (
            <>
              <PriorKnowledgeKeywordsInput value={keywords} onChange={setKeywords} />

              {/* Start Button */}
              <button
                onClick={handleStartSession}
                disabled={!topic.trim() || isLoading}
                className="w-full bg-success-gradient text-white font-semibold text-base py-3 px-5 rounded-3xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              >
                <RocketIcon className="w-5 h-5" />
                <span>Start ExplAIner Session</span>
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
