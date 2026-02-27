'use client';

interface AnswerOptionProps {
  label: string; // A, B, C, D
  text: string;
  isSelected: boolean;
  isChecked: boolean; // Has the user checked their answer yet?
  showCorrect: boolean; // Selected and correct
  showIncorrect: boolean; // Selected but incorrect
  showMissed: boolean; // Not selected but was correct
  onToggle: () => void;
}

/** AnswerOption component - displays a single answer option for a practice block question, color-coded based on its state */
export default function AnswerOption({
  label,
  text,
  isSelected,
  isChecked,
  showCorrect,
  showIncorrect,
  showMissed,
  onToggle,
}: AnswerOptionProps) {
  // Determine styling based on the answer option's state
  let containerClasses = 'relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all';
  if (showCorrect) {
    containerClasses += ' bg-practice-correct/15 border-practice-correct'; // correct = green
  } else if (showIncorrect) {
    containerClasses += ' bg-practice-incorrect/15 border-practice-incorrect'; // incorrect = red
  } else if (showMissed) {
    containerClasses += ' bg-practice-missed/8 border-practice-missed/40'; // missed = light green
  } else if (isSelected) {
    containerClasses += ' bg-primary/10 border-primary cursor-pointer'; // selected (but not yet checked) = primary
  } else {
    containerClasses += ' bg-card border-border hover:border-primary cursor-pointer'; // unselected = default
  }

  // Prevent clicks after checking
  const handleClick = () => {
    if (!isChecked) {
      onToggle();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={containerClasses}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Label (A, B, C, D) */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-foreground">
        {label}
      </div>

      {/* Answer text */}
      <div className="flex-1 text-base text-foreground">
        {text}
      </div>

      {/* Status icons (only shown after checking) */}
      {showCorrect && (
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-practice-correct flex items-center justify-center">
          <svg
            className="w-4 h-4 text-white"
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
        </div>
      )}
      {showIncorrect && (
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-practice-incorrect flex items-center justify-center">
          <svg
            className="w-4 h-4 text-white"
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
        </div>
      )}
      {showMissed && (
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-practice-missed/40 flex items-center justify-center">
          <svg
            className="w-4 h-4 text-practice-missed/70"
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
        </div>
      )}
    </div>
  );
}
