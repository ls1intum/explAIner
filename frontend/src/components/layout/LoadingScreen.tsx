'use client';

import Image from 'next/image';
import { LOADING_SCREEN_MESSAGES } from '@/lib/loadingMessages';
import { getRandomMessage } from '@/lib/utils';
import { useMemo } from 'react';

export default function LoadingScreen() {
  // Select a random message once when component mounts
  const loadingMessage = useMemo(() => getRandomMessage(LOADING_SCREEN_MESSAGES), []);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-6 bg-background">
      {/* Flying Owlbert Icon */}
      <div className="mb-8 animate-bounce">
        <Image
          src="/images/owlbert/flying.png"
          alt="Owlbert is thinking..."
          width={150}
          height={150}
          className="object-contain"
          priority
        />
      </div>

      {/* Loading Message */}
      <p className="text-muted-foreground text-center text-lg max-w-md">
        {loadingMessage}
      </p>
    </div>
  );
}
