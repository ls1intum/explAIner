'use client';

import { useTranslation } from '@/lib/i18n/useTranslation';

interface FeedbackMessageProps {
  isCorrect: boolean;
}

/** FeedbackMessage component - shows feedback after user checks their answer */
export default function FeedbackMessage({ isCorrect }: FeedbackMessageProps) {
  const { t } = useTranslation();

  // Feedback message text & color (based on correctness of answer)
  const message = isCorrect
    ? t('practiceBlock.feedback.correct') as string
    : t('practiceBlock.feedback.incorrect') as string;
  const bgClass = isCorrect ? 'bg-success/10' : 'bg-destructive/10';
  const borderClass = isCorrect ? 'border-success' : 'border-destructive';
  const textClass = isCorrect ? 'text-success' : 'text-destructive';

  return (
    <div className={`p-4 rounded-xl flex items-center gap-3 ${bgClass}`}>
      <div
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center bg-transparent ${borderClass}`}
      >
        {/* Status icon */}
        {isCorrect ? (
          <svg
            className={`w-4 h-4 ${textClass}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          <svg
            className={`w-4 h-4 ${textClass}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
      </div>
      {/* Feedback message */}
      <p className={`font-medium ${textClass}`}>{message}</p>
    </div>
  );
}
