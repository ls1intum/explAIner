'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon, ExitIcon, RocketIcon } from '@radix-ui/react-icons';
import { useAppDispatch } from '@/store/hooks';
import { useDeleteSessionMutation } from '@/store/api/sessionsApi';
import { resetSession } from '@/store/slices/sessionSlice';
import EndSessionDialog from '@/components/session/dialogs/EndSessionDialog';
import BlockNavigation from '@/components/session/BlockNavigation';
import { useTranslation } from '@/lib/i18n/useTranslation';

/** Navbar component */
export default function Navbar() {

  // Navigation
  const router = useRouter();

  // i18n
  const { t, locale, setLocale } = useTranslation();

  // Extract pathname and determine current page
  const pathname = usePathname();
  const isLandingPage = pathname === '/';
  const isImpressumPage = pathname === '/impressum';
  const isLearningGoalPage = pathname === '/learning-goal';
  const isSessionPage = pathname.startsWith('/session/');

  // Redux store hooks
  const dispatch = useAppDispatch();

  // API call hook
  const [deleteSession] = useDeleteSessionMutation();
  
  // Init & sync component state
  const [showEndSessionDialog, setShowEndSessionDialog] = useState(false);

  // "End Session" button is clicked (dialog)
  const sessionIdFromPath = isSessionPage ? pathname.split('/')[2] : null;
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

        {/* Back button when on impressum page */}
        {isImpressumPage && (
          <button
            onClick={() => router.back()}
            className="text-white hover:text-gray-200 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <ChevronLeftIcon className="w-5 h-5" />
            <span>{t('navbar.back') as string}</span>
          </button>
        )}

        {/* Session Start indicator when on session page */}
        {isSessionPage && (
          <>
            <div className="text-white flex items-center gap-2 text-sm font-medium flex-shrink-0">
              <RocketIcon className="w-5 h-5" />
              <span>{t('navbar.sessionStart') as string}</span>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-white/60 flex-shrink-0" />
            {/* Block Navigation (min-w-0 so flex child can shrink and scroll horizontally when many blocks) */}
            <div className="flex-1 min-w-0">
              <BlockNavigation />
            </div>
          </>
        )}

        {/* Spacer when not on impressum, learning goal, or session page */}
        {!isImpressumPage && !isLearningGoalPage && !isSessionPage && <div className="flex-1"></div>}

        {/* Impressum link when on landing page */}
        {isLandingPage && (
          <Link
            href="/impressum"
            className="text-gray-300 hover:text-white transition-colors text-sm pr-0"
          >
            {t('navbar.impressum') as string}
          </Link>
        )}

        {/* Exit button when on learning goal page or session page */}
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
              <span>{t('navbar.endSession') as string}</span>
            </button>
          </>
        )}

        {/* Language toggle */}
        <button
          onClick={() => setLocale(locale === 'de' ? 'en' : 'de')}
          className="ml-auto flex-shrink-0 px-3 py-1 rounded-full border border-white/40 text-white text-xs font-bold hover:bg-white/20 transition-colors uppercase"
          aria-label="Toggle language"
        >
          {locale === 'de' ? 'EN' : 'DE'}
        </button>
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
