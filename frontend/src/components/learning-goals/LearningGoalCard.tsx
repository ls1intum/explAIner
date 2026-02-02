'use client';

interface LearningGoalCardProps {
  goal: string;
  actionVerb: 'define' | 'explain' | 'analyze';
  isSelected: boolean;
  onClick: () => void;
}

const actionVerbColors = {
  define: 'text-primary',
  explain: 'text-accent',
  analyze: 'text-primary',
};

export default function LearningGoalCard({ goal, actionVerb, isSelected, onClick }: LearningGoalCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left px-6 py-4 rounded-2xl border-2 transition-all
        ${isSelected 
          ? 'bg-secondary border-secondary' 
          : 'bg-card border-secondary hover:bg-secondary/20'
        }
      `}
    >
      <p className="text-sm text-muted-foreground leading-relaxed">
        After this session, you will be able to{' '}
        <span className={`font-semibold ${actionVerbColors[actionVerb]}`}>
          {actionVerb}
        </span>{' '}
        {goal}
      </p>
    </button>
  );
}
