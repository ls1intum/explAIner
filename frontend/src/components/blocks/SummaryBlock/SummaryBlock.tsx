'use client';

import { useRouter } from 'next/navigation';
import type { Block } from '@/types/domain/block.types';
import { BLOCK_TYPE } from '@/types/domain/enums';
import LearningGoalAchievement from './LearningGoalAchievement';
import SessionStats from './SessionStats';
import FeedbackRating from './FeedbackRating';

interface SummaryBlockProps {
  block: Block;
  sessionInfo: {
    learningGoal: string;
    bloomsLevel: string;
    totalBlocks: number;
    sessionDuration: number;
  };
}

/** SummaryBlock component */
export default function SummaryBlock({ block, sessionInfo }: SummaryBlockProps) {
  const router = useRouter();
  const summaryBlock = block.type === BLOCK_TYPE.SUMMARY ? block.summaryBlock : undefined;

  if (!summaryBlock) return null;

  const { sessionSummary } = summaryBlock;
  const { learningGoal, bloomsLevel, totalBlocks, sessionDuration } = sessionInfo;

  // Parse summary content to render with markdown-style formatting
  const renderSummary = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2);
        return (
          <strong key={index} className="font-semibold text-primary">
            {boldText}
          </strong>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const handleStartNewSession = () => {
    router.push('/');
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[80%] space-y-6">
        <div className="bg-card rounded-2xl shadow-sm border border-border p-8 space-y-6">
          
          {/* Learning goal achievement message */}
          <LearningGoalAchievement learningGoal={learningGoal} bloomsLevel={bloomsLevel} />

          {/* Total number of blocks completed & session duration */}
          <SessionStats totalBlocks={totalBlocks} sessionDuration={sessionDuration} />

          {/* Session summary text */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              SUMMARY
            </h3>
            <div className="text-base text-foreground leading-relaxed">
              {renderSummary(sessionSummary)}
            </div>
          </div>

          {/* Feedback section where the user can rate the session as helpful or unhelpful (1-5) */}
          <FeedbackRating sessionId={block.sessionId} />
        </div>

        {/* "Start New Session" button */}
        <button
          onClick={handleStartNewSession}
          className="w-full bg-brand-gradient text-white font-semibold text-lg py-4 rounded-xl hover:opacity-90 transition-opacity shadow-lg"
        >
          Start New Session
        </button>
      </div>
    </div>
  );
}
