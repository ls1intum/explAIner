'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  return (
    <nav className="w-full bg-brand-gradient px-6 py-4">
      <div className="w-full flex justify-end">
        {isLandingPage && (
          <Link 
            href="/impressum" 
            className="text-gray-300 hover:text-white transition-colors text-sm pr-0"
          >
            Impressum
          </Link>
        )}
        {/* Other navbar items can be added here for other pages */}
      </div>
    </nav>
  );
}
