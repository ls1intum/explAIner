'use client';

import { useState } from 'react';
import LearningGoalCard from './LearningGoalCard';
import CustomLearningGoalInput from './CustomLearningGoalInput';

interface LearningGoal {
  id: string;
  goal: string;
  actionVerb: 'define' | 'explain' | 'analyze';
}

interface LearningGoalSelectorProps {
  goals: LearningGoal[];
  selectedGoalId: string | null;
  onSelectGoal: (goalId: string) => void;
  customGoal: string;
  onCustomGoalChange: (goal: string) => void;
}

export default function LearningGoalSelector({
  goals,
  selectedGoalId,
  onSelectGoal,
  customGoal,
  onCustomGoalChange,
}: LearningGoalSelectorProps) {
  return (
    <div className="w-full space-y-4">
      {goals.map((goal) => (
        <LearningGoalCard
          key={goal.id}
          goal={goal.goal}
          actionVerb={goal.actionVerb}
          isSelected={selectedGoalId === goal.id}
          onClick={() => onSelectGoal(goal.id)}
        />
      ))}
      
      <CustomLearningGoalInput
        value={customGoal}
        onChange={onCustomGoalChange}
      />
    </div>
  );
}
