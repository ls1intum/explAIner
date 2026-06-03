'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RocketIcon } from '@radix-ui/react-icons';
import LearningGoalCard from '@/components/learning-goals/LearningGoalCard';
import CustomLearningGoalCard from '@/components/learning-goals/CustomLearningGoalCard';
import LoadingScreen from '@/components/shared/ui/LoadingScreen';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useCreateSessionMutation } from '@/store/api/sessionsApi';
import { clearSessionCreationData } from '@/store/slices/sessionSlice';
import type { LearningGoal } from '@/types/domain/learning-goals.types';
import { BLOOMS_LEVELS, type BloomsLevel } from '@/types/domain/enums';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function LearningGoalPageClient() {

  // Navigation
  const router = useRouter();

  // i18n
  const { t } = useTranslation();

  // Redux store hooks
  const dispatch = useAppDispatch();
  const { topic, priorKnowledge, learningGoals } = useAppSelector((state) => state.session);

  // API call hook
  const [createSession, { isLoading: isCreatingSession }] = useCreateSessionMutation();

  // Extract page data
  const pageData =
  learningGoals === null ? null : { topic, priorKnowledge, learningGoals };

  // Init & sync component state
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [showPredefined, setShowPredefined] = useState(true);
  const [customObjective, setCustomObjective] = useState('');
  const [customBloomsLevel, setCustomBloomsLevel] = useState<BloomsLevel>(BLOOMS_LEVELS[1]);

  if (!pageData) return null;

  // "Choose a learning goal..." button is clicked (shows predefined learning goals)
  const handleShowPredefined = () => {
    if (!showPredefined) setShowPredefined(true);
  };

  // "... or enter your own learning goal" button is clicked (shows custom learning goal input)
  const handleShowCustom = () => {
    if (showPredefined) setShowPredefined(false);
  };

  // Single learning goal card is clicked (selects 1 of  predefined learning goal)
  const handleSelectGoal = (goalId: string) => {
    setSelectedGoalId(goalId);
    setCustomObjective('');
  };

  // Custom learning goal objective input is changed (updates custom objective)
  const handleCustomObjectiveChange = (objective: string) => {
    setCustomObjective(objective);
    if (objective.trim()) setSelectedGoalId(null);
  };

  // Check if "Let's Start!" button can be enabled (either predefined or custom learning goal is selected)
  const canStart = showPredefined
  ? selectedGoalId !== null
  : customObjective.trim().length > 0;

  // "Let's Start!" button is clicked (creates session and navigates to session page)
  const handleStartSession = async () => {
    if (!pageData) return;

    // Derive learning goal and Bloom's level from selected learning goal or custom learning goal input
    let selectedGoal: string;
    let selectedBloomsLevel: BloomsLevel;
    if (!showPredefined && customObjective.trim()) {
      selectedGoal = `After this session, I can ${customBloomsLevel} ${customObjective.trim()}.`;
      selectedBloomsLevel = customBloomsLevel;
    } else {
      const predefinedGoal = pageData.learningGoals.find((_goal: LearningGoal, index: number) => selectedGoalId === index.toString());
      if (!predefinedGoal) return;
      selectedGoal = predefinedGoal.learningGoal;
      selectedBloomsLevel = predefinedGoal.bloomsLevel;
    }

    // Create session
    try {
      const response = await createSession({
        topic: pageData.topic,
        learningGoal: { learningGoal: selectedGoal, bloomsLevel: selectedBloomsLevel },
        priorKnowledge: pageData.priorKnowledge?.trim() || undefined,
      }).unwrap();
      dispatch(clearSessionCreationData());
      router.push(`/session/${response.id}`);
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  if (isCreatingSession) return <LoadingScreen />;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-background">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6">

        {/* Owlbert avatar */}
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
          {t('learningGoal.title') as string}
        </h1>

        {/* Subtitle */}
        <p className="text-muted-foreground text-center mb-8 max-w-xl">
          {t('learningGoal.subtitle') as string}
        </p>

        {/* Learning goal selection (predefined or custom) */}
        <div className="w-full max-w-2xl mb-6 space-y-4">

          {/* Predefined 3 learning goals (shown by default) */}
          {showPredefined ? (
            <div className="w-full bg-muted rounded-3xl p-6 space-y-4">
              <div className="w-full text-center text-muted-foreground font-semibold text-base">
                {t('learningGoal.choosePredefined') as string}
              </div>
              <div className="space-y-3">
                {pageData.learningGoals.map((goal: LearningGoal, index: number) => (
                  <LearningGoalCard
                    key={index}
                    learningGoal={goal.learningGoal}
                    bloomsLevel={goal.bloomsLevel}
                    isSelected={selectedGoalId === index.toString()}
                    onClick={() => handleSelectGoal(index.toString())}
                  />
                ))}
              </div>
            </div>
          ) : (
            <button
              onClick={handleShowPredefined}
              className="w-full bg-muted text-muted-foreground font-semibold text-base py-3 px-5 rounded-3xl hover:bg-muted/80 transition-all text-center"
            >
              {t('learningGoal.choosePredefined') as string}
            </button>
          )}

          {/* Custom learning goal input */}
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
              {t('learningGoal.enterOwn') as string}
            </button>
          )}
        </div>

        {/* "Let's Start!" button */}
        <button
          onClick={handleStartSession}
          disabled={!canStart || isCreatingSession}
          className="w-full max-w-2xl bg-success-gradient text-white font-semibold text-base py-3 px-5 rounded-3xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
        >
          <RocketIcon className="w-5 h-5" />
          <span>{isCreatingSession ? t('learningGoal.creatingSession') as string : t('learningGoal.startButton') as string}</span>
        </button>
      </main>
    </div>
  );
}
