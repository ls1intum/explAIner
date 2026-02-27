'use client';

import Image from 'next/image';

interface ChatMessageLoadingBubbleProps {
  loadingMessage: string;
}

/** Loading state row: Owlbert avatar + animated "..." message */
export default function ChatMessageLoadingBubble({ loadingMessage }: ChatMessageLoadingBubbleProps) {
  return (
    <div className="flex gap-3 items-start animate-fadeIn">
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
        <Image
          src="/images/owlbert/chat.png"
          alt="Owlbert"
          width={40}
          height={40}
          className="object-contain"
        />
      </div>
      <div className="max-w-[85%] rounded-2xl p-5 bg-muted rounded-tl-sm">
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
