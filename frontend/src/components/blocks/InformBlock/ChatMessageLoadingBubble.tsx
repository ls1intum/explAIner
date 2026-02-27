'use client';

import Image from 'next/image';

interface ChatMessageLoadingBubbleProps {
  loadingMessage: string;
}

/** ChatMessageLoadingBubble component - displays the loading animation chat message while the answer is generated */
export default function ChatMessageLoadingBubble({ loadingMessage }: ChatMessageLoadingBubbleProps) {
  return (
    <div className="flex gap-3 items-start">
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
        {/* Owlbert avatar */}
        <Image
          src="/images/owlbert/chat.png"
          alt="Owlbert"
          width={40}
          height={40}
          className="object-contain"
        />
      </div>
      {/* Chat message bubble */}
      <div className="max-w-[85%] rounded-2xl p-5 bg-muted rounded-tl-sm">
        {/* Funny & cute Owlbert loading message */}
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground italic text-sm">{loadingMessage}</span>
          <div className="flex gap-1">
            <span className="animate-bounce">.</span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
