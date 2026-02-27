'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RocketIcon } from '@radix-ui/react-icons';
import LearningGoalCard from '@/components/learning-goals/LearningGoalCard';
import CustomLearningGoalCard from '@/components/learning-goals/CustomLearningGoalCard';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useCreateSessionMutation } from '@/store/api/sessionsApi';
import { setLoading } from '@/store/slices/uiSlice';
import { clearSessionCreationData } from '@/store/slices/sessionSlice';
import type { LearningGoal } from '@/types/domain/learning-goals.types';

export default function LearningGoalPageClient() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { topic, priorKnowledge, learningGoals } = useAppSelector((state) => state.session);
  const pageData =
    learningGoals === null ? null : { topic, keywords: priorKnowledge, goals: learningGoals };

  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [showPredefined, setShowPredefined] = useState(true);
  const [customObjective, setCustomObjective] = useState('');
  const [customBloomsLevel, setCustomBloomsLevel] = useState('Understand');
  const [createSession, { isLoading }] = useCreateSessionMutation();
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);

  useEffect(() => {
    return () => {
      dispatch(setLoading(false));
    };
  }, [dispatch]);

  const handleShowPredefined = () => {
    if (!showPredefined) setShowPredefined(true);
  };

  const handleShowCustom = () => {
    if (showPredefined) setShowPredefined(false);
  };

  const handleSelectGoal = (goalId: string) => {
    setSelectedGoalId(goalId);
    setCustomObjective('');
  };

  const handleCustomObjectiveChange = (objective: string) => {
    setCustomObjective(objective);
    if (objective.trim()) setSelectedGoalId(null);
  };

  const handleStartSession = async () => {
    if (!pageData) return;

    let finalGoal: string;
    let finalBloomsLevel: string;

    if (!showPredefined && customObjective.trim()) {
      finalGoal = `After this session, you will be able to ${customBloomsLevel} ${customObjective.trim()}.`;
      finalBloomsLevel = customBloomsLevel;
    } else {
      const selectedGoal = pageData.goals.find((_goal: LearningGoal, index: number) => selectedGoalId === index.toString());
      if (!selectedGoal) return;
      finalGoal = selectedGoal.learningGoal;
      finalBloomsLevel = selectedGoal.bloomsLevel;
    }

    try {
      setShowLoadingScreen(true);
      dispatch(setLoading(true));

      type BloomsLevel = 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create';
      const response = await createSession({
        topic: pageData.topic,
        learningGoal: { learningGoal: finalGoal, bloomsLevel: finalBloomsLevel as BloomsLevel },
        priorKnowledge: pageData.keywords?.trim() || undefined,
      }).unwrap();

      dispatch(clearSessionCreationData());
      router.push(`/session/${response.id}`);
    } catch (error) {
      console.error('Failed to create session:', error);
      setShowLoadingScreen(false);
      dispatch(setLoading(false));
    }
  };

  const canStart = showPredefined
    ? selectedGoalId !== null
    : customObjective.trim().length > 0;

  if (!pageData) return null;
  if (showLoadingScreen) return <LoadingScreen />;

  const transformedGoals = pageData.goals.map((goal: LearningGoal, index: number) => {
    const prefix = 'After this session, you will be able to ';
    let objective = goal.learningGoal;
    if (objective.startsWith(prefix)) objective = objective.substring(prefix.length);
    const bloomsLevel = goal.bloomsLevel;
    if (objective.startsWith(bloomsLevel + ' ')) objective = objective.substring(bloomsLevel.length + 1);
    return { id: index.toString(), goal: objective, bloomsLevel };
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-background">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <div className="mb-6">
          <Image
            src="/images/owlbert/practice.png"
            alt="Owlbert the Owl"
            width={80}
            height={80}
            className="object-contain"
          />
        </div>

        <h1 className="text-4xl font-bold text-brand-gradient mb-3">
          Learning Goal
        </h1>
        <p className="text-muted-foreground text-center mb-8 max-w-xl">
          Specify the learning goal for your ExplAIner session
        </p>

        <div className="w-full max-w-2xl mb-6 space-y-4">
          {showPredefined ? (
            <div className="w-full bg-muted rounded-3xl p-6 space-y-4">
              <div className="w-full text-center text-muted-foreground font-semibold text-base">
                Choose a learning goal...
              </div>
              <div className="space-y-3">
                {transformedGoals.map((goal: (typeof transformedGoals)[number]) => (
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
              Choose a learning goal...
            </button>
          )}

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
              ... or enter your own learning goal
            </button>
          )}
        </div>

        <button
          onClick={handleStartSession}
          disabled={!canStart || isLoading}
          className="w-full max-w-2xl bg-success-gradient text-white font-semibold text-base py-3 px-5 rounded-3xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
        >
          <RocketIcon className="w-5 h-5" />
          <span>{isLoading ? 'Creating session...' : "Let's Start!"}</span>
        </button>
      </main>
    </div>
  );
}
