'use client';

import Image from 'next/image';
import ChatMessageContent from './ChatMessageContent';

interface ChatMessageBubbleProps {
  sender: 'User' | 'Owlbert';
  message: string;
}

/** ChatMessageBubble component - displays a single chat message (from user or Owlbert) */
export default function ChatMessageBubble({ sender, message }: ChatMessageBubbleProps) {
  const isUser = sender === 'User';

  return (
    <div className={`flex gap-3 items-start ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Owlbert avatar */}
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
      {/* Chat message bubble */}
      <div
        className={`max-w-[85%] rounded-2xl p-5 ${
          isUser ? 'bg-primary/50 text-foreground rounded-tr-sm' : 'bg-muted rounded-tl-sm'
        }`}
      >
        <ChatMessageContent message={message} />
      </div>
    </div>
  );
}
