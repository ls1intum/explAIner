'use client';

interface FollowUpQuestionQuickChipsProps {
  onQuestionClick: (label: string) => void;
  disabled?: boolean;
}

/** Preset follow-up prompts (e.g. simpler explanation, more details) */
export default function FollowUpQuestionQuickChips({
  onQuestionClick,
  disabled = false,
}: FollowUpQuestionQuickChipsProps) {
  const quickActions = [
    { id: 1, label: 'Try a simpler explanation' },
    { id: 2, label: 'Give more details' },
    { id: 3, label: 'Use (different) examples' },
  ];

  const handleQuickAction = (label: string) => {
    if (!disabled) {
      onQuestionClick(label);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {quickActions.map((action) => (
        <button
          key={action.id}
          onClick={() => handleQuickAction(action.label)}
          disabled={disabled}
          className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-medium hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
