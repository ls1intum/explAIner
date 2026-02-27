'use client';

import { useEffect, useRef } from 'react';
import { ReaderIcon, QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setCurrentBlockIndex } from '@/store/slices/sessionSlice';
import { useGetSessionQuery, useUpdateCurrentBlockIndexMutation } from '@/store/api/sessionsApi';
import type { Block } from '@/types/domain/block.types';
import { BLOCK_TYPE } from '@/types/domain/enums';

export default function BlockNavigation() {
  const dispatch = useAppDispatch();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeChipRef = useRef<HTMLButtonElement>(null);
  const { sessionId: sessionIdFromState, currentBlockIndex, highestAlreadyViewedBlockIndex } = useAppSelector((state) => state.session);
  const { data: sessionData } = useGetSessionQuery(
    { sessionId: sessionIdFromState! },
    { skip: !sessionIdFromState }
  );
  const sessionId = sessionIdFromState ?? '';
  const [updateCurrentBlockIndex] = useUpdateCurrentBlockIndexMutation();

  const blocks = sessionData?.blocks ?? [];
  const effectiveMax = Math.max(currentBlockIndex, highestAlreadyViewedBlockIndex);
  const viewedBlocks = blocks
    .filter((block: Block) => block.alreadyViewed || block.orderIndex <= effectiveMax)
    .sort((a: Block, b: Block) => a.orderIndex - b.orderIndex);

  // Scroll so the active chip is visible (navbar is horizontally scrollable)
  useEffect(() => {
    activeChipRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [currentBlockIndex, viewedBlocks.length]);

  const handleBlockClick = (index: number) => {
    dispatch(setCurrentBlockIndex(index));
    void updateCurrentBlockIndex({ sessionId, currentBlockIndex: index });
  };

  if (viewedBlocks.length === 0) {
    return null;
  }

  return (
    <div
      ref={scrollContainerRef}
      className="flex items-center gap-0 overflow-x-auto overflow-y-hidden min-w-0 scrollbar-thin"
      style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
    >
      {viewedBlocks.map((block: Block, viewedIndex: number) => {
        const index = block.orderIndex;
        const isActive = index === currentBlockIndex;
        const isPast = index < currentBlockIndex;

        return (
          <div key={block.id} className="flex items-center flex-shrink-0">
            {viewedIndex > 0 && (
              <div className="h-[2px] w-4 bg-white/40 flex-shrink-0" />
            )}

            <button
              ref={isActive ? activeChipRef : undefined}
              onClick={() => handleBlockClick(index)}
              className={`
                flex items-center justify-center gap-1.5 rounded-full
                font-medium transition-all whitespace-nowrap flex-shrink-0
                ${
                  isActive
                    ? 'bg-white text-primary shadow-md px-5 py-2 text-base'
                    : isPast
                    ? 'bg-white/90 text-primary hover:bg-white px-4 py-1.5 text-sm'
                    : 'bg-white/60 text-white hover:bg-white/80 px-4 py-1.5 text-sm'
                }
              `}
              aria-label={`${block.type} block ${index + 1}`}
              title={`${block.type} block ${index + 1}`}
              type="button"
            >
              {block.type === BLOCK_TYPE.INFORM ? (
                <ReaderIcon className={isActive ? 'w-5 h-5' : 'w-4 h-4'} />
              ) : block.type === BLOCK_TYPE.PRACTICE ? (
                <QuestionMarkCircledIcon className={isActive ? 'w-5 h-5' : 'w-4 h-4'} />
              ) : null}
              <span>{block.type}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
