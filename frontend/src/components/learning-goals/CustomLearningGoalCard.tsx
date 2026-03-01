'use client';

import { BLOOMS_LEVELS, type BloomsLevel } from '@/types/domain/enums';

interface CustomLearningGoalCardProps {
  objective: string;
  bloomsLevel: BloomsLevel;
  onObjectiveChange: (value: string) => void;
  onBloomsLevelChange: (value: BloomsLevel) => void;
}

/** CustomLearningGoalCard component - allows the user to enter a custom learning goal within the pre-defined structure:"After this session, you will be able to <Bloom's level> <objective>". */
export default function CustomLearningGoalCard({ 
  objective, 
  bloomsLevel,
  onObjectiveChange,
  onBloomsLevelChange,
}: CustomLearningGoalCardProps) {
  return (
    <div className="w-full bg-muted rounded-3xl p-6 space-y-4">
      {/* Header */}
      <div className="w-full text-center text-muted-foreground font-semibold text-base">
        ... or enter your own learning goal
      </div>
      
      {/* Horizontal buttons for selecting Bloom's levels */}
      <div className="w-full space-y-3">
        <label className="block text-sm text-muted-foreground px-1">
          Choose your complexity level:
        </label>
        <div className="w-full flex gap-2">
          {BLOOMS_LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => onBloomsLevelChange(level)}
              className={`flex-1 px-3 py-2 rounded-2xl border-2 text-xs font-semibold transition-all ${
                bloomsLevel === level
                  ? 'border-secondary bg-secondary text-primary'
                  : 'border-secondary bg-card text-muted-foreground hover:bg-secondary/20'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
        
        {/* Label for objective input */}
        <label className="block text-sm text-muted-foreground px-1 pt-2">
          Enter your objective:
        </label>
        
        {/* Text input for objective */}
        <input
          type="text"
          value={objective}
          onChange={(e) => onObjectiveChange(e.target.value)}
          placeholder="Enter objective..."
          className="w-full px-6 py-3 rounded-2xl border-2 border-secondary bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />
      </div>

      {/* "Live Preview" card */}
      <div className="w-full">
        <label className="block text-sm text-muted-foreground mb-2 px-1">
          Preview
        </label>
        <div className="w-full px-6 py-4 rounded-2xl border-2 border-secondary bg-secondary/20">
          <p className="text-sm text-muted-foreground leading-relaxed">
            After this session, you will be able to{' '}
            <span className="font-semibold text-primary">
              {bloomsLevel}
            </span>{' '}
            {objective.trim() || <span className="text-muted-foreground italic">your objective</span>}
            {objective.trim() && '.'}
          </p>
        </div>
      </div>
    </div>
  );
}
