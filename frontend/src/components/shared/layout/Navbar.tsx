'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon, ExitIcon, RocketIcon } from '@radix-ui/react-icons';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useDeleteSessionMutation } from '@/store/api/sessionsApi';
import { resetSession } from '@/store/slices/sessionSlice';
import EndSessionDialog from '@/components/session/dialogs/EndSessionDialog';
import BlockNavigation from '@/components/session/BlockNavigation';

/** Navbar component */
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.ui.isLoading);
  const isLandingPage = pathname === '/';
  const isImpressumPage = pathname === '/impressum';
  const isLearningGoalPage = pathname === '/learning-goal';
  const isSessionPage = pathname.startsWith('/session/');
  const sessionIdFromPath = isSessionPage ? pathname.split('/')[2] : null;
  const [deleteSession] = useDeleteSessionMutation();
  
  // End session dialog state
  const [showEndSessionDialog, setShowEndSessionDialog] = useState(false);

  // Handle end session dialog confirmation
  const handleEndSession = async () => {
    setShowEndSessionDialog(false);
    if (sessionIdFromPath) {
      try {
        await deleteSession({ sessionId: sessionIdFromPath }).unwrap();
      } catch (error) {
        console.error('Failed to delete session:', error);
      }
    }
    dispatch(resetSession());
    router.push('/');
  };

  return (
    <nav className="w-full bg-brand-gradient px-6 py-4">
      <div className="w-full flex items-center gap-4 min-h-[2rem]">
        {isLoading ? (
          <>
            {/* Show invisible placeholder when loading to maintain navbar height */}
            <div className="invisible flex items-center gap-2 text-sm font-medium">
              <span className="w-5 h-5"></span>
              <span>Placeholder</span>
            </div>
            <div className="flex-1"></div>
            <div className="invisible flex items-center gap-2 text-sm font-medium">
              <span className="w-5 h-5"></span>
              <span>End Session</span>
            </div>
          </>
        ) : (
          <>
            {/* Back button on the left when on impressum page */}
            {isImpressumPage && (
              <button
                onClick={() => router.back()}
                className="text-white hover:text-gray-200 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <ChevronLeftIcon className="w-5 h-5" />
                <span>Back</span>
              </button>
            )}
            
            {/* Session Start indicator on session page */}
            {isSessionPage && (
              <>
                <div className="text-white flex items-center gap-2 text-sm font-medium flex-shrink-0">
                  <RocketIcon className="w-5 h-5" />
                  <span>Session Start</span>
                </div>
                
                {/* Separator arrow */}
                <ChevronRightIcon className="w-5 h-5 text-white/60 flex-shrink-0" />
                
                {/* Block Navigation (min-w-0 so flex child can shrink and scroll horizontally when many blocks) */}
                <div className="flex-1 min-w-0">
                  <BlockNavigation />
                </div>
              </>
            )}
            
            {/* Spacer when not on impressum, learning goal, or session page */}
            {!isImpressumPage && !isLearningGoalPage && !isSessionPage && <div className="flex-1"></div>}
            
            {/* Impressum link on the right when on landing page */}
            {isLandingPage && (
              <Link 
                href="/impressum" 
                className="text-gray-300 hover:text-white transition-colors text-sm pr-0"
              >
                Impressum
              </Link>
            )}

            {/* Exit button on learning goal page and session page */}
            {(isLearningGoalPage || isSessionPage) && (
              <>
                {isLearningGoalPage && <div className="flex-1"></div>}
                <button
                  onClick={() => {
                    if (isSessionPage) {
                      setShowEndSessionDialog(true);
                    } else {
                      router.push('/');
                    }
                  }}
                  className="text-white hover:text-gray-200 transition-colors flex items-center gap-2 text-sm font-medium flex-shrink-0"
                >
                  <ExitIcon className="w-5 h-5" />
                  <span>End Session</span>
                </button>
              </>
            )}
          </>
        )}
      </div>
      
      {/* "End Session" dialog */}
      <EndSessionDialog
        isOpen={showEndSessionDialog}
        onClose={() => setShowEndSessionDialog(false)}
        onConfirm={handleEndSession}
      />
    </nav>
  );
}
