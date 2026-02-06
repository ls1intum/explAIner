'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon, ExitIcon, RocketIcon } from '@radix-ui/react-icons';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useDeleteSessionMutation } from '@/store/api/sessionsApi';
import { resetSession } from '@/store/slices/sessionSlice';
import EndSessionDialog from '@/components/session/EndSessionDialog';
import BlockNavigation from '@/components/layout/BlockNavigation';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.ui.isLoading);
  const currentSessionId = useAppSelector((state) => state.session.currentSessionId);
  const isLandingPage = pathname === '/';
  const isImpressumPage = pathname === '/impressum';
  const isLearningGoalPage = pathname === '/learning-goal';
  const isSessionPage = pathname.startsWith('/session/');
  
  // Dialog state
  const [showEndSessionDialog, setShowEndSessionDialog] = useState(false);
  
  // Delete session mutation
  const [deleteSession] = useDeleteSessionMutation();
  
  // Handle end session confirmation
  const handleEndSession = async () => {
    setShowEndSessionDialog(false);
    
    // Delete session from database if we have a sessionId
    if (currentSessionId) {
      try {
        await deleteSession({ sessionId: currentSessionId }).unwrap();
      } catch (error) {
        console.error('Failed to delete session:', error);
      }
    }
    
    // Clear frontend state
    dispatch(resetSession());
    
    // Navigate to home
    router.push('/');
  };

  return (
    <nav className="w-full bg-brand-gradient px-6 py-4">
      <div className="w-full flex items-center gap-4 min-h-[2rem]">
        {/* Show invisible placeholder when loading to maintain height */}
        {isLoading ? (
          <>
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
                
                {/* Block Navigation */}
                <div className="flex-1 overflow-x-auto">
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
      
      {/* End Session Dialog */}
      <EndSessionDialog
        isOpen={showEndSessionDialog}
        onClose={() => setShowEndSessionDialog(false)}
        onConfirm={handleEndSession}
      />
    </nav>
  );
}
