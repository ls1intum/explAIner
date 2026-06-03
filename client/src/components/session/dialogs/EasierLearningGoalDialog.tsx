'use client';

import { useTranslation } from '@/lib/i18n/useTranslation';

interface EasierLearningGoalDialogProps {
  isOpen: boolean;
  onContinueWithCurrentSession: () => void;
  onStartNewSessionWithEasierLearningGoal: () => void;
}

/** EasierLearningGoalDialog component - displays a dialog to choose between continuing with the current learning goal or starting a new session with easier learning goals */
export default function EasierLearningGoalDialog({
  isOpen,
  onContinueWithCurrentSession,
  onStartNewSessionWithEasierLearningGoal,
}: EasierLearningGoalDialogProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {/* Dialog */}
      <div className="bg-card rounded-2xl shadow-xl p-6 max-w-md mx-4 space-y-4">
        {/* Title */}
        <h2 className="text-xl font-semibold text-foreground">
          {t('easierGoalDialog.title') as string}
        </h2>
        {/* Subtitle */}
        <p className="text-muted-foreground">
          {t('easierGoalDialog.subtitle') as string}
        </p>
        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onContinueWithCurrentSession}
            className="w-full bg-success-gradient text-white font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity"
          >
            {t('easierGoalDialog.continueCurrentGoal') as string}
          </button>
          <button
            onClick={onStartNewSessionWithEasierLearningGoal}
            className="w-full bg-brand-gradient text-white font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity"
          >
            {t('easierGoalDialog.adjustGoal') as string}
          </button>
        </div>
      </div>
    </div>
  );
}
