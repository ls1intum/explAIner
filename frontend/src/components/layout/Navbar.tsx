'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronLeftIcon, ExitIcon } from '@radix-ui/react-icons';
import { useAppSelector } from '@/store/hooks';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isLoading = useAppSelector((state) => state.ui.isLoading);
  const isLandingPage = pathname === '/';
  const isImpressumPage = pathname === '/impressum';
  const isLearningGoalPage = pathname === '/learning-goal';

  return (
    <nav className="w-full bg-brand-gradient px-6 py-4">
      <div className="w-full flex items-center justify-between min-h-[2rem]">
        {/* Show invisible placeholder when loading to maintain height */}
        {isLoading ? (
          <>
            <div className="invisible flex items-center gap-2 text-sm font-medium">
              <span className="w-5 h-5"></span>
              <span>Placeholder</span>
            </div>
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
            
            {/* Spacer when not on impressum or learning goal page */}
            {!isImpressumPage && !isLearningGoalPage && <div></div>}
            
            {/* Impressum link on the right when on landing page */}
            {isLandingPage && (
              <Link 
                href="/impressum" 
                className="text-gray-300 hover:text-white transition-colors text-sm pr-0"
              >
                Impressum
              </Link>
            )}

            {/* Exit button on learning goal page */}
            {isLearningGoalPage && (
              <>
                <div></div>
                <button
                  onClick={() => router.push('/')}
                  className="text-white hover:text-gray-200 transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <ExitIcon className="w-5 h-5" />
                  <span>End Session</span>
                </button>
              </>
            )}
          </>
        )}
      </div>
    </nav>
  );
}
