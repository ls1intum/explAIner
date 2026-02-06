interface GoalAdjustmentDialogProps {
  isOpen: boolean;
  onContinueWithCurrentGoal: () => void;
  onAdjustGoal: () => void;
}

export default function GoalAdjustmentDialog({
  isOpen,
  onContinueWithCurrentGoal,
  onAdjustGoal,
}: GoalAdjustmentDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-2xl shadow-xl p-6 max-w-md mx-4 space-y-4">
        <h2 className="text-xl font-semibold text-foreground">
          Choose Your Path
        </h2>
        <p className="text-muted-foreground">
          Would you like to adjust your learning goal to focus on the fundamentals first, or continue with the current goal?
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onContinueWithCurrentGoal}
            className="w-full bg-success-gradient text-white font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity"
          >
            Continue with Current Goal
          </button>
          <button
            onClick={onAdjustGoal}
            className="w-full bg-brand-gradient text-white font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity"
          >
            Adjust Learning Goal
          </button>
        </div>
      </div>
    </div>
  );
}
