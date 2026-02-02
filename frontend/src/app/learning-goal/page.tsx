'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RocketIcon } from '@radix-ui/react-icons';
import LearningGoalSelector from '@/components/learning-goals/LearningGoalSelector';
import { useAppSelector } from '@/store/hooks';
import type { LearningGoalPageData } from '@/types/learning-goals.types';

export default function LearningGoalPage() {
  const router = useRouter();
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [customGoal, setCustomGoal] = useState('');
  
  // Get learning goals data from Redux
  const pageData = useAppSelector((state) => state.learningGoals.pageData);

  // Redirect to home if no data is available
  useEffect(() => {
    if (!pageData) {
      router.push('/');
    }
  }, [pageData, router]);

  const handleStartSession = () => {
    if (!pageData) return;

    // Get the selected goal
    const selectedGoal = pageData.goals.find((_, index) => selectedGoalId === index.toString());
    const finalGoal = customGoal.trim() || selectedGoal?.learningGoal || '';

    // TODO: Navigate to session page with selected goal and topic
    console.log('Starting session with:', {
      topic: pageData.topic,
      keywords: pageData.keywords,
      learningGoal: finalGoal,
      bloomsLevel: selectedGoal?.bloomsLevel,
    });
  };

  const hasSelectedGoal = selectedGoalId !== null || customGoal.trim().length > 0;

  // Show nothing while loading data
  if (!pageData) {
    return null;
  }

  // Transform goals for the selector component
  const transformedGoals = pageData.goals.map((goal, index) => ({
    id: index.toString(),
    goal: goal.learningGoal.replace('After this session, you will be able to ', ''),
    actionVerb: goal.actionVerb as 'define' | 'explain' | 'analyze',
  }));

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-background overflow-hidden">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        {/* Owlbert Icon */}
        <div className="mb-6">
          <Image
            src="/images/owlbert/practice.png"
            alt="Owlbert the Owl"
            width={80}
            height={80}
            className="object-contain"
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-brand-gradient mb-3">
          Learning Goal
        </h1>

        {/* Subtitle */}
        <p className="text-muted-foreground text-center mb-8 max-w-xl">
          Specify the learning goal for your ExplAIner session
        </p>

        {/* Learning Goal Selector */}
        <div className="w-full max-w-2xl mb-6">
          <LearningGoalSelector
            goals={transformedGoals}
            selectedGoalId={selectedGoalId}
            onSelectGoal={(goalId) => {
              setSelectedGoalId(goalId);
              setCustomGoal(''); // Clear custom goal when selecting a predefined goal
            }}
            customGoal={customGoal}
            onCustomGoalChange={(goal) => {
              setCustomGoal(goal);
              if (goal.trim()) {
                setSelectedGoalId(null); // Clear selected goal when typing custom goal
              }
            }}
          />
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartSession}
          disabled={!hasSelectedGoal}
          className="w-full max-w-2xl bg-success-gradient text-white font-semibold text-base py-3 px-5 rounded-3xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
        >
          <RocketIcon className="w-5 h-5" />
          <span>Let&apos;s Start!</span>
        </button>
      </main>
    </div>
  );
}
