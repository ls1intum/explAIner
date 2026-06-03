'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import type { Block } from '@/types/domain/block.types';
import { BLOCK_TYPE } from '@/types/domain/enums';
import { useGenerateChatResponseMutation } from '@/store/api/blocksApi';
import { useAppDispatch } from '@/store/hooks';
import { addToast } from '@/store/slices/uiSlice';
import { getRandomMessage } from '@/lib/i18n';
import { useTranslation } from '@/lib/i18n/useTranslation';
import ChatMessageBubble from './ChatMessageBubble';
import ChatMessageLoadingBubble from './ChatMessageLoadingBubble';
import FollowUpQuestionTextInputField from './FollowUpQuestionTextInputField';

interface InformBlockProps {
  block: Block;
  sessionId: string;
  onContinue: () => void;
  hideContinueButton?: boolean;
}

/** InformBlock component */
export default function InformBlock({
  block,
  sessionId,
  onContinue,
  hideContinueButton = false,
}: InformBlockProps) {

  // Refs used for auto-scroll behavior in chat window
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const previousMessageCountRef = useRef(0);

  // i18n
  const { t } = useTranslation();

  // Redux store hook
  const dispatch = useAppDispatch();

  // API call hook
  const [generateChatResponse, { isLoading }] = useGenerateChatResponseMutation();

  // Extract block data
  const informBlock = block.type === BLOCK_TYPE.INFORM ? block.informBlock : undefined;

  // Init & sync component state
  const [chatMessages, setChatMessages] = useState(informBlock?.messages ?? []);
  useEffect(() => {
    setChatMessages(informBlock?.messages ?? []);
  }, [block, informBlock?.messages]); // Sync local state (e.g. after block refetch or when navigating blocks)
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [loadingMessage, setLoadingMessage] = useState(() =>
    getRandomMessage(t('loading.chatMessages') as string[])
  );

  // Auto-scroll behavior of chat window 
  useEffect(() => {
    // Scroll to top of chat window when navigating back to this block from a different block
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = 0;
    }
  }, [block.id]);
  useEffect(() => {
    // Scroll to bottom of chat window when new messages are added or while loading
    if (chatMessages.length > previousMessageCountRef.current || isLoading) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    previousMessageCountRef.current = chatMessages.length;
  }, [chatMessages.length, isLoading]);

  // Follow-up question is sent (optimistic UI, then API)
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
    setChatMessages((prev) => [...prev, userMessage]);
    if (!messageText) setFollowUpQuestion('');
    setLoadingMessage(getRandomMessage(t('loading.chatMessages') as string[]));

    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

    try {
      const data = await generateChatResponse({
        sessionId,
        orderIndex: String(block.orderIndex),
        message,
      }).unwrap();
      const owlbertResponse = {
        id: `temp-ai-${Date.now()}`,
        informBlockId: block.id,
        message: data.response,
        sender: 'Owlbert' as const,
        timestamp: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, owlbertResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      dispatch(addToast({ message: t('informBlock.error.sendMessage') as string, type: 'error' }));
      setChatMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
    }
  };

  // Quick action chip is clicked (sends label as new message in chat input field)
  const handleQuickActionClick = (actionLabel: string) => {
    handleSendQuestion(actionLabel);
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[80%] space-y-4">
        {/* Card */}
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          <div
            ref={chatContainerRef}
            className="max-h-[500px] overflow-y-auto p-6 space-y-4"
          >
            {/* All chat messages */}
            {chatMessages.map((msg) => (
              // Chat message
              <ChatMessageBubble
                key={msg.id}
                sender={msg.sender}
                message={msg.message}
              />
            ))}
            {/* Loading animation chat message while the answer is generated */}
            {isLoading && <ChatMessageLoadingBubble loadingMessage={loadingMessage} />}
            <div ref={chatEndRef} />
          </div>

          {/* Follow-up questions text input field and quick action chips */}
          <FollowUpQuestionTextInputField
            value={followUpQuestion}
            onChange={setFollowUpQuestion}
            onSend={() => handleSendQuestion()}
            onQuickAction={handleQuickActionClick}
            disabled={isLoading}
          />
        </div>

        {/* Continue button */}
        {!hideContinueButton && (
          <div className="flex justify-end">
            <span className="inline-block rounded-xl shadow-lg overflow-hidden">
              <button
                onClick={onContinue}
                className="bg-success-gradient text-white font-semibold text-base py-3 px-8 rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 border-0 appearance-none"
              >
                <span>{t('informBlock.continue') as string}</span>
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
