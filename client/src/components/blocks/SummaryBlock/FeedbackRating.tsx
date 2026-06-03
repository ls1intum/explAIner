'use client';

import { useState } from 'react';
import { useSubmitFeedbackMutation } from '@/store/api/sessionsApi';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface FeedbackRatingProps {
  sessionId: string;
}

/** FeedbackRating component - allows the user to rate the session as helpful or unhelpful */
export default function FeedbackRating({ sessionId }: FeedbackRatingProps) {

  const { t } = useTranslation();

  const feedbackOptions = [
    { emoji: '😞', label: t('feedbackRating.veryUnhelpful') as string, value: 1 },
    { emoji: '😕', label: t('feedbackRating.somewhatUnhelpful') as string, value: 2 },
    { emoji: '😐', label: t('feedbackRating.neutral') as string, value: 3 },
    { emoji: '🙂', label: t('feedbackRating.helpful') as string, value: 4 },
    { emoji: '😊', label: t('feedbackRating.veryHelpful') as string, value: 5 },
  ];

  // API call hook
  const [submitFeedback] = useSubmitFeedbackMutation();

  // Init & sync component state
  const [selectedFeedback, setSelectedFeedback] = useState<number | null>(null);
  
  // Feedback emoji is clicked (submits feedback to server)
  const handleFeedbackClick = async (value: number) => {
    setSelectedFeedback(value);
    try {
      await submitFeedback({
        sessionId,
        rating: value,
      }).unwrap();
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  return (
    <div className="border-t border-border pt-6 space-y-3">
      {/* Question */}
      <p className="text-center text-sm text-muted-foreground italic">
        {t('feedbackRating.question') as string}
      </p>
      {/* All feedback options */}
      <div className="flex justify-center gap-4">
        {feedbackOptions.map((option) => (
          /* Feedback option */
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
            {/* Tooltip with label */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              {option.label}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
