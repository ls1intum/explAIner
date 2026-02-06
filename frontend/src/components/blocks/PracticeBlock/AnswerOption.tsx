'use client';

interface AnswerOptionProps {
  label: string; // A, B, C, D
  text: string;
  isSelected: boolean;
  isChecked: boolean; // Has the user checked their answer?
  showCorrect: boolean; // Selected and correct
  showIncorrect: boolean; // Selected but incorrect
  showMissed: boolean; // Not selected but was correct
  onToggle: () => void;
}

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
  // Determine styling based on state
  let containerClasses = 'relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all';
  
  if (showCorrect) {
    // Selected and correct (green background)
    containerClasses += ' bg-[#10b981]/15 border-[#10b981]';
  } else if (showIncorrect) {
    // Selected but incorrect (red background)
    containerClasses += ' bg-[#ef4444]/15 border-[#ef4444]';
  } else if (showMissed) {
    // Not selected but was correct (light green background, faded)
    containerClasses += ' bg-[#10b981]/8 border-[#10b981]/40';
  } else if (isSelected) {
    // Selected but not checked yet (primary color highlight)
    containerClasses += ' bg-primary/10 border-primary cursor-pointer';
  } else {
    // Unselected (default)
    containerClasses += ' bg-card border-border hover:border-primary cursor-pointer';
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

      {/* Answer Text */}
      <div className="flex-1 text-base text-foreground">
        {text}
      </div>

      {/* Status Icons (only shown after checking) */}
      {showCorrect && (
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#10b981] flex items-center justify-center">
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
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#ef4444] flex items-center justify-center">
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
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#10b981]/40 flex items-center justify-center">
          <svg
            className="w-4 h-4 text-[#10b981]/70"
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
