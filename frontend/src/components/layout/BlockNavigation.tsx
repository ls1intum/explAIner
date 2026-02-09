'use client';

import { ReaderIcon, QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setCurrentBlockIndex } from '@/store/slices/sessionSlice';
import { BlockType } from '@/types/domain';
import type { Block } from '@/types/domain';

export default function BlockNavigation() {
  const dispatch = useAppDispatch();
  const { currentBlockIndex, blockQueue } = useAppSelector((state) => state.session);

  // Filter to only show blocks that have been viewed
  const viewedBlocks = blockQueue.filter((block) => block.alreadyViewed);

  // Navigate to specific block
  const handleBlockClick = (index: number) => {
    dispatch(setCurrentBlockIndex(index));
  };

  if (viewedBlocks.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
      {viewedBlocks.map((block: Block, viewedIndex: number) => {
        const index = block.orderIndex;
        const isActive = index === currentBlockIndex;
        const isPast = index < currentBlockIndex;
        const isFuture = index > currentBlockIndex;

        return (
          <div key={block.id} className="flex items-center">
            {/* Horizontal line before each chip except the first */}
            {viewedIndex > 0 && (
              <div className="h-[2px] w-4 bg-white/40 flex-shrink-0" />
            )}
            
            {/* Block chip */}
            <button
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
            >
              {block.type === BlockType.INFORM ? (
                <ReaderIcon className={isActive ? 'w-5 h-5' : 'w-4 h-4'} />
              ) : block.type === BlockType.PRACTICE ? (
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
