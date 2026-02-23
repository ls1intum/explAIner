import { useState } from 'react';
import { useSubmitFeedbackMutation } from '@/store/api/sessionsApi';

interface FeedbackRatingProps {
  sessionId: string;
}

export default function FeedbackRating({ sessionId }: FeedbackRatingProps) {
  const [selectedFeedback, setSelectedFeedback] = useState<number | null>(null);
  const [submitFeedback] = useSubmitFeedbackMutation();

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
        sessionId,
        rating: value,
      }).unwrap();
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  return (
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
  );
}
