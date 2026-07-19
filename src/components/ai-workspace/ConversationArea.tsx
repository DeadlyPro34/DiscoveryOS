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
    <div className="flex flex-col h-full bg-[#f0faf5]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6" data-lenis-prevent>
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div className="bg-white p-8 rounded-xl border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full mx-4">
              <h2 className="text-[22px] font-black text-black mb-2">
                Start Exploring Evidence
              </h2>
              <p className="text-[#777] text-[14px] mb-6 leading-relaxed">
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
                    className="p-3 text-left bg-[#FFE066] hover:-translate-y-0.5 border-[3px] border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm text-black font-bold transition-all"
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
              <div className="flex gap-2 items-center bg-[#fff] p-4 rounded-[14px] border-[1.5px] border-[#e5e5e5] max-w-[80%]">
                <TypingIndicator />
                <span className="text-sm font-medium text-[#777]">
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
          <input
            ref={inputRef}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about customer pain points, features to build, retention risks..."
            disabled={isLoading}
            className="flex-1 px-4 h-[44px] bg-[#fff] border-[3px] border-black rounded-xl outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-y-[2px] transition-all text-sm font-bold placeholder:font-normal"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className="flex items-center justify-center w-[44px] h-[44px] bg-[#38DBFF] hover:-translate-y-0.5 text-black border-[3px] border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>

        <p className="text-xs text-[#777] mt-3 text-center">
          Powered by customer evidence. All responses backed by real quotes and sentiment analysis.
        </p>
      </div>
    </div>
  );
}
