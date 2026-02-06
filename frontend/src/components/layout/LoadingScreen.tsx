'use client';

import Image from 'next/image';
import { LOADING_SCREEN_MESSAGES } from '@/lib/loadingMessages';
import { getRandomMessage } from '@/lib/utils';
import { useState, useEffect } from 'react';

export default function LoadingScreen() {
  // Start with default message to avoid hydration mismatch on page reload
  const [loadingMessage, setLoadingMessage] = useState(LOADING_SCREEN_MESSAGES[0]);

  // Select random message only after client-side mount
  useEffect(() => {
    setLoadingMessage(getRandomMessage(LOADING_SCREEN_MESSAGES));
  }, []);

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
