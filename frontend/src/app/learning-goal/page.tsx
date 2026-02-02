'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RocketIcon } from '@radix-ui/react-icons';
import LearningGoalCard from '@/components/learning-goals/LearningGoalCard';
import CustomLearningGoalCard from '@/components/learning-goals/CustomLearningGoalCard';
import { useAppSelector } from '@/store/hooks';

export default function LearningGoalPage() {
  const router = useRouter();
  const pageData = useAppSelector((state) => state.learningGoals.pageData);
  
  // State for predefined goals
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [showPredefined, setShowPredefined] = useState(true);
  
  // State for custom goal
  const [customObjective, setCustomObjective] = useState('');
  const [customBloomsLevel, setCustomBloomsLevel] = useState('Understand');

  // Redirect to home if no data is available
  useEffect(() => {
    if (!pageData) {
      router.push('/');
    }
  }, [pageData, router]);

  // Handle toggling between predefined and custom
  const handleShowPredefined = () => {
    if (!showPredefined) {
      setShowPredefined(true);
    }
  };

  const handleShowCustom = () => {
    if (showPredefined) {
      setShowPredefined(false);
    }
  };

  // Handle goal selection
  const handleSelectGoal = (goalId: string) => {
    setSelectedGoalId(goalId);
    setCustomObjective('');
  };

  const handleCustomObjectiveChange = (objective: string) => {
    setCustomObjective(objective);
    if (objective.trim()) {
      setSelectedGoalId(null);
    }
  };

  // Start session handler
  const handleStartSession = () => {
    if (!pageData) return;

    let finalGoal: string;
    let finalBloomsLevel: string;
    
    if (!showPredefined && customObjective.trim()) {
      // Use custom goal
      finalGoal = `After this session, you will be able to ${customBloomsLevel} ${customObjective.trim()}.`;
      finalBloomsLevel = customBloomsLevel;
    } else {
      // Use selected predefined goal
      const selectedGoal = pageData.goals.find((_, index) => selectedGoalId === index.toString());
      if (!selectedGoal) return;
      
      finalGoal = selectedGoal.learningGoal;
      finalBloomsLevel = selectedGoal.bloomsLevel;
    }

    // TODO: Navigate to session page with selected goal and topic
    console.log('Starting session with:', {
      topic: pageData.topic,
      keywords: pageData.keywords,
      learningGoal: finalGoal,
      bloomsLevel: finalBloomsLevel,
    });
  };

  // Check if start button should be enabled
  const canStart = showPredefined 
    ? selectedGoalId !== null 
    : customObjective.trim().length > 0;

  // Show nothing while loading data
  if (!pageData) {
    return null;
  }

  // Transform goals to extract objective part
  const transformedGoals = pageData.goals.map((goal, index) => {
    const prefix = 'After this session, you will be able to ';
    let objective = goal.learningGoal;
    
    if (objective.startsWith(prefix)) {
      objective = objective.substring(prefix.length);
    }
    
    const bloomsLevel = goal.bloomsLevel;
    if (objective.startsWith(bloomsLevel + ' ')) {
      objective = objective.substring(bloomsLevel.length + 1);
    }
    
    return {
      id: index.toString(),
      goal: objective,
      bloomsLevel: bloomsLevel,
    };
  });

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

        {/* Learning Goal Selection */}
        <div className="w-full max-w-2xl mb-6 space-y-4">
          {/* Predefined Goals Card */}
          {showPredefined ? (
            <div className="w-full bg-muted rounded-3xl p-6 space-y-4">
              <div className="w-full text-center text-muted-foreground font-semibold text-base">
                Choose learning goal...
              </div>
              <div className="space-y-3">
                {transformedGoals.map((goal) => (
                  <LearningGoalCard
                    key={goal.id}
                    goal={goal.goal}
                    bloomsLevel={goal.bloomsLevel}
                    isSelected={selectedGoalId === goal.id}
                    onClick={() => handleSelectGoal(goal.id)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <button
              onClick={handleShowPredefined}
              className="w-full bg-muted text-muted-foreground font-semibold text-base py-3 px-5 rounded-3xl hover:bg-muted/80 transition-all text-center"
            >
              Choose learning goal...
            </button>
          )}

          {/* Custom Goal Card */}
          {!showPredefined ? (
            <CustomLearningGoalCard
              objective={customObjective}
              bloomsLevel={customBloomsLevel}
              onObjectiveChange={handleCustomObjectiveChange}
              onBloomsLevelChange={setCustomBloomsLevel}
            />
          ) : (
            <button
              onClick={handleShowCustom}
              className="w-full bg-muted text-muted-foreground font-semibold text-base py-3 px-5 rounded-3xl hover:bg-muted/80 transition-all text-center"
            >
              ... or create your own
            </button>
          )}
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartSession}
          disabled={!canStart}
          className="w-full max-w-2xl bg-success-gradient text-white font-semibold text-base py-3 px-5 rounded-3xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
        >
          <RocketIcon className="w-5 h-5" />
          <span>Let&apos;s Start!</span>
        </button>
      </main>
    </div>
  );
}
