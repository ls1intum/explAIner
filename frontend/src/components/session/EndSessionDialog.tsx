'use client';

import { ExitIcon } from '@radix-ui/react-icons';

interface EndSessionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function EndSessionDialog({
  isOpen,
  onClose,
  onConfirm,
}: EndSessionDialogProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-fadeIn"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-card rounded-3xl shadow-xl max-w-md w-full p-8 animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <ExitIcon className="w-12 h-12 text-primary" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-center mb-3 text-foreground">
            End session?
          </h2>

          {/* Subtitle */}
          <p className="text-center text-muted-foreground mb-8">
            Your progress won't be saved.
          </p>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-6 rounded-xl border border-border bg-transparent text-foreground font-semibold hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 px-6 rounded-xl bg-brand-gradient text-white font-semibold hover:opacity-90 transition-opacity"
            >
              End Session
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
