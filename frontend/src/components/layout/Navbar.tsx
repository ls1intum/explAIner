'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronLeftIcon } from '@radix-ui/react-icons';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isLandingPage = pathname === '/';
  const isImpressumPage = pathname === '/impressum';

  return (
    <nav className="w-full bg-brand-gradient px-6 py-4">
      <div className="w-full flex items-center justify-between">
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
        
        {/* Spacer when not on impressum page */}
        {!isImpressumPage && <div></div>}
        
        {/* Impressum link on the right when on landing page */}
        {isLandingPage && (
          <Link 
            href="/impressum" 
            className="text-gray-300 hover:text-white transition-colors text-sm pr-0"
          >
            Impressum
          </Link>
        )}
      </div>
    </nav>
  );
}
