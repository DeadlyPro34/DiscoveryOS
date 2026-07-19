/**
 * ConversationArea Component
 * Central message history + input area
 */

import React, { useState, useRef, useEffect } from 'react';
import type { Message } from '@/types/ai-workspace';
import { MessageBubble } from './MessageBubble';
import { AIResponse } from './AIResponse';
import { TypingIndicator } from './TypingIndicator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader } from 'lucide-react';

interface ConversationAreaProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
  streamingResponse?: {
    text: string;
    response?: any;
  };
}

export function ConversationArea({
  messages,
  onSendMessage,
  isLoading = false,
  streamingResponse,
}: ConversationAreaProps): React.ReactElement {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingResponse]);

  const handleSend = () => {
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue('');
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Start Exploring Evidence
              </p>
              <p className="text-slate-600 dark:text-slate-400 max-w-xs">
                Ask questions about customer pain points, feature priorities, retention risks, and more.
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map(message => (
              <div key={message.id}>
                {message.role === 'user' ? (
                  <MessageBubble message={message} isUser />
                ) : (
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                    <AIResponse response={message.content as any} isLoading={isLoading} />
                  </div>
                )}
              </div>
            ))}

            {/* Streaming Response */}
            {streamingResponse && (
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                {streamingResponse.response ? (
                  <AIResponse
                    response={streamingResponse.response}
                    streamingText={streamingResponse.text}
                    isLoading={isLoading}
                  />
                ) : (
                  <div className="flex gap-2 items-center">
                    <TypingIndicator />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Analyzing customer evidence...
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Loading Indicator */}
            {isLoading && !streamingResponse && (
              <div className="flex gap-2 items-center">
                <TypingIndicator />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Generating response...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-slate-950">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about customer pain points, features to build, retention risks..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className="gap-2"
            size="icon"
          >
            {isLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          Powered by customer evidence. All responses backed by real quotes and sentiment analysis.
        </p>
      </div>
    </div>
  );
}
