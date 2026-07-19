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
    <div className="flex flex-col h-full bg-[#F4F4F0] border-x-[3px] border-black">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div className="bg-white p-8 rounded-xl border-[3px] border-black shadow-neo max-w-md">
              <h2 className="text-2xl font-black text-black mb-4">
                Start Exploring Evidence
              </h2>
              <p className="text-black font-medium mb-6">
                Ask questions about customer pain points, feature priorities, retention risks, and more.
              </p>
              
              <div className="flex flex-col gap-3">
                {[
                  "What is our biggest customer pain point?",
                  "Which feature should we build next?",
                  "Generate a PRD for Dark Mode",
                  "Summarize authentication issues"
                ].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => onSendMessage(prompt)}
                    className="p-3 text-left bg-[#FF90E8] hover:bg-[#FF90E8]/80 border-[3px] border-black rounded-xl font-bold transition-transform hover:-translate-y-1 hover:shadow-neo"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map(message => (
              <div key={message.id}>
                {message.role === 'user' ? (
                  <MessageBubble message={message} isUser />
                ) : (
                  <MessageBubble message={message} isUser={false} />
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-2 items-center bg-white p-4 rounded-xl border-[3px] border-black max-w-[80%]">
                <TypingIndicator />
                <span className="text-sm font-bold">
                  Analyzing customer evidence...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t-[3px] border-black p-4 bg-white">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about customer pain points, features to build, retention risks..."
            disabled={isLoading}
            className="flex-1 border-[3px] border-black rounded-xl font-medium focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-black"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className="gap-2 border-[3px] border-black rounded-xl shadow-neo hover:-translate-y-1 hover:shadow-neo transition-transform bg-[#38DBFF] text-black font-black hover:bg-[#38DBFF]/80"
            size="icon"
          >
            {isLoading ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>

        <p className="text-xs font-bold text-black/60 mt-3 text-center">
          Powered by customer evidence. All responses backed by real quotes and sentiment analysis.
        </p>
      </div>
    </div>
  );
}
