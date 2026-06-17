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
  /** Hide the Owlbert follow-up chat (input + quick chips), leaving reading material only. */
  hideChat?: boolean;
  /** While true, the continue button is still hidden but a loading indicator is shown in its place. */
  isPreparingContinue?: boolean;
  /** Embedded (iframe) mode: use the full available width and scale the content area with the viewport. */
  embedded?: boolean;
}

/** InformBlock component */
export default function InformBlock({
  block,
  sessionId,
  onContinue,
  hideContinueButton = false,
  hideChat = false,
  isPreparingContinue = false,
  embedded = false,
}: InformBlockProps) {

  // Refs used for auto-scroll behavior in chat window
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

  // Auto-scroll behavior of chat window.
  // NOTE: We scroll the inner chat container directly instead of using
  // scrollIntoView(). scrollIntoView() scrolls *all* scrollable ancestors,
  // which in embedded (iframe) mode includes the host page (e.g. the
  // questionnaire tool) — making it jump to the bottom and hide ExplAIner.
  // scrollTo on the container keeps the scroll contained within the chat.
  const scrollChatToBottom = (behavior: ScrollBehavior = 'smooth') => {
    chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior });
  };
  const lastBlockIdRef = useRef<string | null>(null);
  useEffect(() => {
    const isNewBlock = lastBlockIdRef.current !== block.id;
    if (isNewBlock) {
      // Initial load or navigating to another block: start at the top so the
      // reader sees the beginning of the material — never auto-scroll here.
      chatContainerRef.current?.scrollTo({ top: 0 });
    } else if (chatMessages.length > previousMessageCountRef.current || isLoading) {
      // Same block with genuinely new messages (follow-up Q&A) or a response
      // being generated: keep the latest message in view inside the chat box.
      scrollChatToBottom();
    }
    lastBlockIdRef.current = block.id;
    previousMessageCountRef.current = chatMessages.length;
  }, [block.id, chatMessages.length, isLoading]);

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

    setTimeout(() => scrollChatToBottom(), 100);

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
      <div className={`w-full ${embedded ? '' : 'max-w-[80%]'} space-y-4`}>
        {/* Card */}
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          <div
            ref={chatContainerRef}
            className={`${embedded ? 'max-h-[calc(100vh-240px)]' : 'max-h-[500px]'} overflow-y-auto p-6 space-y-4`}
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
          </div>

          {/* Follow-up questions text input field and quick action chips (hidden for text-only groups) */}
          {!hideChat && (
            <FollowUpQuestionTextInputField
              value={followUpQuestion}
              onChange={setFollowUpQuestion}
              onSend={() => handleSendQuestion()}
              onQuickAction={handleQuickActionClick}
              disabled={isLoading}
            />
          )}
        </div>

        {/* Continue button (shown once practice blocks are ready) */}
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

        {/* Loading indicator (shown while practice blocks are generated in the background) */}
        {hideContinueButton && isPreparingContinue && (
          <div className="flex justify-end">
            <span className="inline-flex items-center gap-3 text-base font-semibold text-muted-foreground py-3 px-8 rounded-xl border border-border bg-card">
              <span className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground animate-spin" />
              <span>{t('informBlock.preparingPractice') as string}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
