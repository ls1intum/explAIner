'use client';

import Image from 'next/image';
import InitialChatMessage from './InitialChatMessage';

interface ChatMessageBubbleProps {
  sender: 'User' | 'Owlbert';
  message: string;
  animationDelay?: number;
}

/** Single chat message row: avatar (Owlbert only) + bubble with parsed message content */
export default function ChatMessageBubble({
  sender,
  message,
  animationDelay = 0,
}: ChatMessageBubbleProps) {
  const isUser = sender === 'User';

  return (
    <div
      className={`flex gap-3 items-start animate-fadeIn ${isUser ? 'flex-row-reverse' : ''}`}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
          <Image
            src="/images/owlbert/chat.png"
            alt="Owlbert"
            width={40}
            height={40}
            className="object-contain"
          />
        </div>
      )}
      <div
        className={`max-w-[85%] rounded-2xl p-5 ${
          isUser ? 'bg-primary/50 text-foreground rounded-tr-sm' : 'bg-muted rounded-tl-sm'
        }`}
      >
        <InitialChatMessage message={message} />
      </div>
    </div>
  );
}
