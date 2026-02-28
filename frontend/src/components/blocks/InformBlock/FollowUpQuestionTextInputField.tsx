'use client';

import FollowUpQuestionQuickChips from './FollowUpQuestionQuickChips';

interface FollowUpQuestionTextInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (messageText?: string) => void;
  onQuickAction: (label: string) => void;
  disabled: boolean;
}

/** FollowUpQuestionTextInputField component - displays the user chat window for follow-up questions (text input, send button, and quick action chips) */
export default function FollowUpQuestionTextInputField({
  value,
  onChange,
  onSend,
  onQuickAction,
  disabled,
}: FollowUpQuestionTextInputFieldProps) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="p-6 pt-4 bg-background/50">
      <div className="flex gap-3 mb-3">
        {/* Text input field */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask a follow-up question..."
          disabled={disabled}
          className="flex-1 px-4 py-3 rounded-full border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {/* Send button */}
        <button
          onClick={() => onSend()}
          disabled={!value.trim() || disabled}
          className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center justify-center"
          aria-label="Send"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </div>
      {/* 3 pre-defined follow-up questions as quick action chips */}
      <FollowUpQuestionQuickChips onQuestionClick={onQuickAction} disabled={disabled} />
    </div>
  );
}
