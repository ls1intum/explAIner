interface LearningGoalAchievementProps {
  learningGoal: string;
  bloomsLevel: string;
}

export default function LearningGoalAchievement({ learningGoal, bloomsLevel }: LearningGoalAchievementProps) {
  // Parse learning goal to highlight Bloom's level
  const renderLearningGoal = (goal: string, level: string) => {
    const parts = goal.split(new RegExp(`(${level})`, 'gi'));
    return parts.map((part, index) => {
      if (part.toLowerCase() === level.toLowerCase()) {
        return (
          <span key={index} className="font-semibold text-[#10b981]">
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="bg-[#10b981]/10 rounded-xl p-6 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#10b981]/20 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-[#10b981]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          LEARNING GOAL ACHIEVED
        </span>
      </div>
      <p className="text-base text-foreground leading-relaxed">
        {renderLearningGoal(learningGoal, bloomsLevel)}
      </p>
    </div>
  );
}
