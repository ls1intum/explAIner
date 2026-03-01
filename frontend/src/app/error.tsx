'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <Image
            src="/images/owlbert/sad.png"
            alt="Owlbert is sad something went wrong"
            width={120}
            height={120}
          />
        </div>
        <h2 className="mb-4 text-2xl font-bold">Something went wrong!</h2>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            className="rounded-xl bg-brand-gradient px-6 py-3 text-white transition-opacity hover:opacity-90"
            onClick={() => reset()}
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-xl bg-success-gradient px-6 py-3 text-white transition-opacity hover:opacity-90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
