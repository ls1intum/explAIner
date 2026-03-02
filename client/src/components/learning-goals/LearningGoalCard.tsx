'use client';

interface LearningGoalCardProps {
  learningGoal: string;
  bloomsLevel: string;
  isSelected: boolean;
  onClick: () => void;
}

/** LearningGoalCard component - displays a single selectable learning-goal card with the pre-defined structure:
 * "After this session, you will be able to <Bloom's level> <objective>". */
export default function LearningGoalCard({ learningGoal, bloomsLevel, isSelected, onClick }: LearningGoalCardProps) {

  // Parse learning goal to display only the objective and Bloom's level
  const { objective } = parseDisplayParts(learningGoal, bloomsLevel);

  return (
    /* Clickable card */
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
      {/* Learning goal */}
      <p className="text-sm text-muted-foreground leading-relaxed">
        After this session, you will be able to{' '}
        <span className="font-semibold text-primary">
          {bloomsLevel}
        </span>{' '}
        {objective}
      </p>
    </button>
  );
}

// Helper function - strips standard prefix and Bloom's level from full learning goal string for display
const PREFIX = 'After this session, you will be able to ';
function parseDisplayParts(learningGoal: string, bloomsLevel: string): { objective: string } {
  let objective = learningGoal;
  if (objective.startsWith(PREFIX)) objective = objective.substring(PREFIX.length);
  if (objective.startsWith(bloomsLevel + ' ')) objective = objective.substring(bloomsLevel.length + 1);
  return { objective };
}