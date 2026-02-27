'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { LOADING_SCREEN_MESSAGES, getRandomMessage } from '@/lib/loadingMessages';

/** LoadingScreen component - displays funny & cute Owlbert messages that are selected randomly each time :) */
export default function LoadingScreen() {

  // selects the message after mount to avoid server-client hydration mismatch
  const [message, setMessage] = useState('...');
  useEffect(() => {
    setMessage(getRandomMessage(LOADING_SCREEN_MESSAGES));
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-6 bg-background">
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
      <p className="text-muted-foreground text-center text-lg max-w-md">
        {message}
      </p>
    </div>
  );
}
