'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RocketIcon } from '@radix-ui/react-icons';
import TopicInput from '@/components/learning-topic/TopicInput';
import PriorKnowledgeInput from '@/components/learning-topic/PriorKnowledgeInput';
import LoadingScreen from '@/components/shared/ui/LoadingScreen';
import { useGenerateLearningGoalsMutation } from '@/store/api/learningGoalsApi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setLoading, addToast } from '@/store/slices/uiSlice';
import { setTopic, setPriorKnowledge, setLearningGoals } from '@/store/slices/sessionSlice';

export default function HomePageClient() {

  // Navigation
  const router = useRouter();

  // Redux store hooks
  const dispatch = useAppDispatch();
  const { topic, priorKnowledge } = useAppSelector((state) => state.session);

  // API call hook
  const [generateLearningGoals, { isLoading }] =
    useGenerateLearningGoalsMutation();

  // Init & sync component state
  const hasStartedTyping = topic.length > 0;
  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [isLoading, dispatch]);

  // "Start ExplAIner Session" button is clicked (generates learning goals and navigates to learning goal page)
  const handleStartSession = async () => {
    try {
      const result = await generateLearningGoals({
        topic,
        priorKnowledge: priorKnowledge.trim() || undefined,
      }).unwrap();
      dispatch(setLearningGoals(result.learningGoals));
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

  // Show loading screen while generating learning goals
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-background">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        
        {/* Owlbert avatar with speech bubble */}
        <div className="relative mb-6 flex flex-col items-center mb-10">
          <div className="relative bg-card border-2 border-secondary rounded-2xl px-4 py-2 shadow-sm whitespace-nowrap mb-4">
            <div className="text-xs text-foreground">
              {hasStartedTyping ? 'I can teach you anything!' : 'Hi, I\'m Owlbert ... Owlbert Einstein'}
            </div>
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

        {/* Title and subtitle (hidden after user started typing) */}
        {!hasStartedTyping && (
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-5xl font-bold mb-3">
              <span className="text-foreground">Expl</span>
              <span className="text-brand-gradient">AI</span>
              <span className="text-foreground">ner</span>
            </h1>
            <p className="text-2xl font-semibold text-brand-gradient">
              Learn at Your Own Pace
            </p>
          </div>
        )}

        <div className="w-full max-w-2xl flex flex-col items-center space-y-6 mt-5">

          {/* Topic input field */}
          <TopicInput value={topic} onChange={(v) => dispatch(setTopic(v))} />

          {/* Prior knowledge input field (shown after user started typing) */}
          {hasStartedTyping && (
            <>
              <PriorKnowledgeInput value={priorKnowledge} onChange={(v) => dispatch(setPriorKnowledge(v))} />

              {/* "Start ExplAIner Session" button */}
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
