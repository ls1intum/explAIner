'use client';

import { BLOOMS_LEVELS, type BloomsLevel } from '@/types/domain/enums';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface CustomLearningGoalCardProps {
  objective: string;
  bloomsLevel: BloomsLevel;
  onObjectiveChange: (value: string) => void;
  onBloomsLevelChange: (value: BloomsLevel) => void;
}

/** CustomLearningGoalCard component - allows the user to enter a custom learning goal within the pre-defined structure:"After this session, I can <Bloom's level> <objective>". */
export default function CustomLearningGoalCard({ 
  objective, 
  bloomsLevel,
  onObjectiveChange,
  onBloomsLevelChange,
}: CustomLearningGoalCardProps) {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-muted rounded-3xl p-6 space-y-4">
      {/* Header */}
      <div className="w-full text-center text-muted-foreground font-semibold text-base">
        {t('learningGoal.enterOwn') as string}
      </div>
      
      {/* Horizontal buttons for selecting Bloom's levels */}
      <div className="w-full space-y-3">
        <label className="block text-sm text-muted-foreground px-1">
          {t('customGoal.complexityLabel') as string}
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
          {t('customGoal.objectiveLabel') as string}
        </label>
        
        {/* Text input for objective */}
        <input
          type="text"
          value={objective}
          onChange={(e) => onObjectiveChange(e.target.value)}
          placeholder={t('customGoal.objectivePlaceholder') as string}
          className="w-full px-6 py-3 rounded-2xl border-2 border-secondary bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />
      </div>

      {/* "Live Preview" card */}
      <div className="w-full">
        <label className="block text-sm text-muted-foreground mb-2 px-1">
          {t('customGoal.previewLabel') as string}
        </label>
        <div className="w-full px-6 py-4 rounded-2xl border-2 border-secondary bg-secondary/20">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('customGoal.previewPrefix') as string}{' '}
            <span className="font-semibold text-primary">
              {bloomsLevel}
            </span>{' '}
            {objective.trim() || <span className="text-muted-foreground italic">{t('customGoal.previewObjectivePlaceholder') as string}</span>}
            {objective.trim() && '.'}
          </p>
        </div>
      </div>
    </div>
  );
}
