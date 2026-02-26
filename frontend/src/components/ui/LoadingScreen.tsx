'use client';

import { useState, useEffect } from 'react';
import { LOADING_SCREEN_MESSAGES } from '@/lib/loadingMessages';
import { getRandomMessage } from '@/lib/utils';
import LoadingScreenShell from './LoadingScreenShell';

/** Client-only loading screen: picks random message after mount to avoid hydration mismatch. */
export default function LoadingScreen() {
  const [message, setMessage] = useState(LOADING_SCREEN_MESSAGES[0]);

  useEffect(() => {
    setMessage(getRandomMessage(LOADING_SCREEN_MESSAGES));
  }, []);

  return <LoadingScreenShell message={message} />;
}
