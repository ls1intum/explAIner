'use client';

import { createPortal } from 'react-dom';
import { ExitIcon } from '@radix-ui/react-icons';

interface EndSessionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

/** EndSessionDialog component - displays a dialog to confirm ending the current session */
export default function EndSessionDialog({
  isOpen,
  onClose,
  onConfirm,
}: EndSessionDialogProps) {
  if (!isOpen || typeof document === 'undefined') return null;

  // Rendered via portal to fix bug where it would not appear above page content on practice blocks
  return createPortal(
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-labelledby="end-session-title">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className="bg-card rounded-3xl shadow-xl max-w-md w-full p-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <ExitIcon className="w-12 h-12 text-primary" />
            </div>
          </div>

          {/* Title */}
          <h2 id="end-session-title" className="text-3xl font-bold text-center mb-3 text-foreground">
            End session?
          </h2>

          {/* Subtitle */}
          <p className="text-center text-muted-foreground mb-8">
            Your progress won&apos;t be saved.
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
    </div>,
    document.body
  );
}
