'use client';

import { useTranslation } from '@/lib/i18n/useTranslation';

interface FollowUpQuestionQuickChipsProps {
  onQuestionClick: (label: string) => void;
  disabled?: boolean;
}

/** FollowUpQuestionQuickChips component - displays 3 pre-defined follow-up questions as quick action chips */
export default function FollowUpQuestionQuickChips({
  onQuestionClick,
  disabled = false,
}: FollowUpQuestionQuickChipsProps) {

  const { t } = useTranslation();

  const quickQuestionChips = [
    { id: 1, label: t('quickChip.simplerExplanation') as string },
    { id: 2, label: t('quickChip.moreDetails') as string },
    { id: 3, label: t('quickChip.examples') as string },
  ];

  // Quick question chip is clicked (sends label as new message in chat input field)
  const handleQuickAction = (label: string) => {
    if (!disabled) {
      onQuestionClick(label);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {/* All quick action chips */}
      {quickQuestionChips.map((chip) => (
        // Quick action chip
        <button
          key={chip.id}
          onClick={() => handleQuickAction(chip.label)}
          disabled={disabled}
          className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-medium hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}
