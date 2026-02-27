'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import type { Block } from '@/types/domain/block.types';
import { BLOCK_TYPE } from '@/types/domain/enums';
import { useGenerateChatResponseMutation } from '@/store/api/blocksApi';
import { getRandomMessage } from '@/lib/loadingMessages';
import { INFORM_BLOCK_CHAT_LOADING_MESSAGES } from '@/lib/loadingMessages';
import ChatMessageBubble from './ChatMessageBubble';
import ChatMessageLoadingBubble from './ChatMessageLoadingBubble';
import FollowUpQuestionTextInputField from './FollowUpQuestionTextInputField';

interface InformBlockProps {
  block: Block;
  sessionId: string;
  onContinue: () => void;
}

/** InformBlock component */
export default function InformBlock({
  block,
  sessionId,
  onContinue,
}: InformBlockProps) {
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const previousMessageCountRef = useRef(0);

  const [generateChatResponse, { isLoading }] = useGenerateChatResponseMutation();
  const loadingMessage = useMemo(
    () => getRandomMessage(INFORM_BLOCK_CHAT_LOADING_MESSAGES),
    []
  );

  const informMessages = useMemo(
    () => (block.type === BLOCK_TYPE.INFORM ? block.informBlock.messages : []),
    [block]
  );
  const [localMessages, setLocalMessages] = useState(informMessages);

  // Sync local messages when block data changes (e.g. after refetch)
  useEffect(() => {
    setLocalMessages(informMessages);
  }, [informMessages]);

  // Scroll to top when switching to a different block
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = 0;
    }
  }, [block.id]);

  // Scroll to bottom when new messages are added or while loading
  useEffect(() => {
    if (localMessages.length > previousMessageCountRef.current || isLoading) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    previousMessageCountRef.current = localMessages.length;
  }, [localMessages.length, isLoading]);

  // Send follow-up question (optimistic UI, then API)
  const handleSendQuestion = async (messageText?: string) => {
    const message = messageText ?? followUpQuestion.trim();
    if (!message) return;

    const userMessage = {
      id: `temp-user-${Date.now()}`,
      informBlockId: block.id,
      message,
      sender: 'User' as const,
      timestamp: new Date().toISOString(),
    };
    setLocalMessages((prev) => [...prev, userMessage]);
    if (!messageText) setFollowUpQuestion('');

    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

    try {
      const data = await generateChatResponse({
        sessionId,
        orderIndex: String(block.orderIndex),
        message,
      }).unwrap();
      const aiMessage = {
        id: `temp-ai-${Date.now()}`,
        informBlockId: block.id,
        message: data.response,
        sender: 'Owlbert' as const,
        timestamp: new Date().toISOString(),
      };
      setLocalMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setLocalMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
    }
  };

  // Quick action chip sends that label as the message
  const handleQuickActionClick = (actionLabel: string) => {
    handleSendQuestion(actionLabel);
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[80%] space-y-4">
        {/* Card */}
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          {/* Scrollable chat area */}
          <div
            ref={chatContainerRef}
            className="max-h-[500px] overflow-y-auto p-6 space-y-4"
          >
            {localMessages.map((msg, index) => (
              <ChatMessageBubble
                key={msg.id}
                sender={msg.sender}
                message={msg.message}
                animationDelay={index * 150}
              />
            ))}
            {isLoading && <ChatMessageLoadingBubble loadingMessage={loadingMessage} />}
            <div ref={chatEndRef} />
          </div>

          {/* Follow-up input and quick actions */}
          <FollowUpQuestionTextInputField
            value={followUpQuestion}
            onChange={setFollowUpQuestion}
            onSend={() => handleSendQuestion()}
            onQuickAction={handleQuickActionClick}
            disabled={isLoading}
          />
        </div>

        {/* Continue button */}
        <div className="flex justify-end">
          <span className="inline-block rounded-xl shadow-lg overflow-hidden">
            <button
              onClick={onContinue}
              className="bg-success-gradient text-white font-semibold text-base py-3 px-8 rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 border-0 appearance-none"
            >
              <span>Continue</span>
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}
