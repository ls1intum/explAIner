'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Block } from '@/types/domain';
import { useSubmitFeedbackMutation } from '@/store/api/sessionsApi';

interface SummaryBlockProps {
  block: Block;
  sessionInfo: {
    learningGoal: string;
    bloomsLevel: string;
    totalBlocks: number;
    sessionDuration: number;
  };
}

export default function SummaryBlock({ block, sessionInfo }: SummaryBlockProps) {
  const router = useRouter();
  const [selectedFeedback, setSelectedFeedback] = useState<number | null>(null);
  const summaryBlock = block.summaryBlock;
  const [submitFeedback] = useSubmitFeedbackMutation();

  if (!summaryBlock) return null;

  const { sessionSummary } = summaryBlock;
  const { learningGoal, bloomsLevel, totalBlocks, sessionDuration } = sessionInfo;

  // Parse summary content to render with markdown-style formatting (with primary color)
  const renderSummary = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2);
        return (
          <strong key={index} className="font-semibold text-primary">
            {boldText}
          </strong>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  // Parse learning goal to highlight Bloom's level
  const renderLearningGoal = (goal: string, level: string) => {
    // Find the Bloom's level word in the goal text
    const parts = goal.split(new RegExp(`(${level})`, 'gi'));
    return parts.map((part, index) => {
      if (part.toLowerCase() === level.toLowerCase()) {
        return (
          <span key={index} className="font-semibold text-[#10b981]">
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  // Feedback emojis with labels
  const feedbackOptions = [
    { emoji: '😞', label: 'Very unhelpful', value: 1 },
    { emoji: '😕', label: 'Somewhat unhelpful', value: 2 },
    { emoji: '😐', label: 'Neutral', value: 3 },
    { emoji: '🙂', label: 'Helpful', value: 4 },
    { emoji: '😊', label: 'Very helpful', value: 5 },
  ];

  const handleFeedbackClick = async (value: number) => {
    setSelectedFeedback(value);
    
    // Submit feedback to backend
    try {
      await submitFeedback({
        sessionId: block.sessionId,
        rating: value,
      }).unwrap();
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  const handleStartNewSession = () => {
    router.push('/');
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[80%] space-y-6">
        {/* Main Card */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-8 space-y-6">
          {/* Learning Goal Section */}
          <div className="bg-[#10b981]/10 rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#10b981]/20 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-[#10b981]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                LEARNING GOAL
              </span>
            </div>
            <p className="text-base text-foreground leading-relaxed">
              {renderLearningGoal(learningGoal, bloomsLevel)}
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 gap-6">
            {/* Blocks Completed */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">{totalBlocks}</div>
                <div className="text-sm text-muted-foreground">Blocks Completed</div>
              </div>
            </div>

            {/* Session Duration */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">
                  {sessionDuration} {sessionDuration === 1 ? 'minute' : 'minutes'}
                </div>
                <div className="text-sm text-muted-foreground">Session Duration</div>
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              SUMMARY
            </h3>
            <div className="text-base text-foreground leading-relaxed">
              {renderSummary(sessionSummary)}
            </div>
          </div>

          {/* Feedback Section */}
          <div className="border-t border-border pt-6 space-y-3">
            <p className="text-center text-sm text-muted-foreground italic">
              Was this explanation session helpful?
            </p>
            <div className="flex justify-center gap-4">
              {feedbackOptions.map((option) => (
                <div key={option.value} className="relative group">
                  <button
                    onClick={() => handleFeedbackClick(option.value)}
                    className={`text-4xl transition-all hover:scale-110 ${
                      selectedFeedback === option.value ? 'scale-125' : 'opacity-60 hover:opacity-100'
                    }`}
                    aria-label={option.label}
                  >
                    {option.emoji}
                  </button>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {option.label}
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Start New Session Button */}
        <button
          onClick={handleStartNewSession}
          className="w-full bg-brand-gradient text-white font-semibold text-lg py-4 rounded-xl hover:opacity-90 transition-opacity shadow-lg"
        >
          Start New Session
        </button>
      </div>
    </div>
  );
}
