'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import type { Block } from '@/types/domain/block.types';
import { BLOCK_TYPE } from '@/types/domain/enums';
import { useGenerateChatResponseMutation } from '@/store/api/blocksApi';
import { getRandomMessage } from '@/lib/loadingMessages';
import { INFORM_BLOCK_CHAT_LOADING_MESSAGES } from '@/lib/loadingMessages';
import QuickActionChips from './QuickActionChips';

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
  const informMessages = useMemo(
    () => (block.type === BLOCK_TYPE.INFORM ? block.informBlock.messages : []),
    [block]
  );
  const [localMessages, setLocalMessages] = useState(informMessages);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const previousMessageCountRef = useRef(0);

  const [generateChatResponse, { isLoading }] = useGenerateChatResponseMutation();
  const loadingMessage = useMemo(
    () => getRandomMessage(INFORM_BLOCK_CHAT_LOADING_MESSAGES),
    []
  );

  useEffect(() => {
    setLocalMessages(informMessages);
  }, [informMessages]);

  // Get inform block messages
  const messages = localMessages;

  // Scroll to top only when switching to a different block
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = 0;
    }
  }, [block.id]);

  // Scroll to bottom when new messages are added (local send or after refetch from server)
  useEffect(() => {
    if (messages.length > previousMessageCountRef.current || isLoading) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    previousMessageCountRef.current = messages.length;
  }, [messages.length, isLoading]);

  // Parse message content to render with markdown-style formatting
  const renderMessage = (message: string) => {
    // Split by sections (KEY FACTS, KEY MISCONCEPTIONS, SUMMARY)
    const sections = message.split(/(?=KEY FACTS|KEY MISCONCEPTIONS|SUMMARY)/);
    
    return sections.map((section, sectionIndex) => {
      // Check if it's a KEY MISCONCEPTIONS, KEY FACTS, or SUMMARY section
      if (section.startsWith('KEY MISCONCEPTIONS')) {
        return (
          <div key={sectionIndex} className="mt-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              KEY MISCONCEPTIONS
            </h3>
            <div className="space-y-3">
              {section
                .replace('KEY MISCONCEPTIONS', '')
                .trim()
                .split('\n')
                .filter((line) => line.trim())
                .map((line, lineIndex) => {
                  // Render each line with bold highlighting
                  const parts = line.split(/(\*\*.*?\*\*)/g);
                  return (
                    <div key={lineIndex} className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span className="flex-1">
                        {parts.map((part, partIndex) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            const boldText = part.slice(2, -2);
                            return (
                              <strong
                                key={partIndex}
                                className="font-semibold text-primary"
                              >
                                {boldText}
                              </strong>
                            );
                          }
                          return <span key={partIndex}>{part}</span>;
                        })}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        );
      } else if (section.startsWith('KEY FACTS')) {
        return (
          <div key={sectionIndex} className="mt-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              KEY FACTS
            </h3>
            <div className="space-y-3">
              {section
                .replace('KEY FACTS', '')
                .trim()
                .split('\n')
                .filter((line) => line.trim())
                .map((line, lineIndex) => {
                  // Render each line with bold highlighting
                  const parts = line.split(/(\*\*.*?\*\*)/g);
                  return (
                    <div key={lineIndex} className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span className="flex-1">
                        {parts.map((part, partIndex) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            const boldText = part.slice(2, -2);
                            return (
                              <strong
                                key={partIndex}
                                className="font-semibold text-primary"
                              >
                                {boldText}
                              </strong>
                            );
                          }
                          return <span key={partIndex}>{part}</span>;
                        })}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        );
      } else if (section.startsWith('SUMMARY')) {
        return (
          <div key={sectionIndex} className="mt-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              SUMMARY
            </h3>
            <div className="text-base leading-relaxed">
              {section
                .replace('SUMMARY', '')
                .trim()
                .split(/(\*\*.*?\*\*)/g)
                .map((part, partIndex) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    const boldText = part.slice(2, -2);
                    return (
                      <strong
                        key={partIndex}
                        className="font-semibold text-primary"
                      >
                        {boldText}
                      </strong>
                    );
                  }
                  return <span key={partIndex}>{part}</span>;
                })}
            </div>
          </div>
        );
      } else {
        // Regular paragraph with bold text highlighting
        const parts = section.split(/(\*\*.*?\*\*)/g);
        return (
          <div key={sectionIndex} className="text-base leading-relaxed">
            {parts.map((part, partIndex) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                const boldText = part.slice(2, -2);
                return (
                  <strong
                    key={partIndex}
                    className="font-semibold text-primary"
                  >
                    {boldText}
                  </strong>
                );
              }
              return <span key={partIndex}>{part}</span>;
            })}
          </div>
        );
      }
    });
  };

  // Handle sending follow-up question
  const handleSendQuestion = async (messageText?: string) => {
    const message = messageText || followUpQuestion.trim();
    if (!message) return;
    
    const userMessage = {
      id: `temp-user-${Date.now()}`,
      informBlockId: block.id,
      message,
      sender: 'User' as const,
      timestamp: new Date().toISOString(),
    };
    setLocalMessages((prev) => [...prev, userMessage]);
    
    // Clear input if it was typed (not from quick action)
    if (!messageText) {
      setFollowUpQuestion('');
    }
    
    // Scroll to bottom immediately to see loading message
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    
    try {
      // Send to API using RTK Query
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
      // Remove the user message on error
      setLocalMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
    }
  };

  // Handle quick action click
  const handleQuickActionClick = (actionLabel: string) => {
    handleSendQuestion(actionLabel);
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendQuestion();
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[80%] space-y-4">
        {/* Card Container */}
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          {/* Scrollable Chat Area */}
          <div 
            ref={chatContainerRef}
            className="max-h-[500px] overflow-y-auto p-6 space-y-4"
          >
            {messages.map((msg, index) => (
              <div
                key={msg.id}
                className={`flex gap-3 items-start animate-fadeIn ${
                  msg.sender === 'User' ? 'flex-row-reverse' : ''
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Avatar (only for Owlbert) */}
                {msg.sender === 'Owlbert' && (
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

                {/* Message Content */}
                <div
                  className={`max-w-[85%] rounded-2xl p-5 ${
                    msg.sender === 'User'
                      ? 'bg-primary/50 text-foreground rounded-tr-sm'
                      : 'bg-muted rounded-tl-sm'
                  }`}
                >
                  {renderMessage(msg.message)}
                </div>
              </div>
              ))}
            {isLoading && (
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
                    <span className="text-muted-foreground italic text-sm">
                      {loadingMessage}
                    </span>
                    <div className="flex gap-1">
                      <span className="animate-bounce">.</span>
                      <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                      <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area (Always Visible) */}
          <div className="p-6 pt-4 bg-background/50">
          {/* Text Input and Send Button */}
          <div className="flex gap-3 mb-3">
            <input
              type="text"
              value={followUpQuestion}
              onChange={(e) => setFollowUpQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a follow-up question..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-full border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={() => handleSendQuestion()}
              disabled={!followUpQuestion.trim() || isLoading}
              className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center justify-center"
              aria-label="Send"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </div>

          {/* Quick Action Chips */}
          <QuickActionChips onQuestionClick={handleQuickActionClick} disabled={isLoading} />
        </div>
      </div>

        {/* Continue Button (Outside Card). Shadow on wrapper to avoid Safari box-shadow + gradient glitch. */}
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
