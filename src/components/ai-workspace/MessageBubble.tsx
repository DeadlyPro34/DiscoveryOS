/**
 * MessageBubble Component
 * Individual message in conversation
 */

import React from 'react';
import type { Message } from '@/types/ai-workspace';
import ReactMarkdown from 'react-markdown';
import { formatDate } from '@/lib/utils/aiResponseFormatter';

interface MessageBubbleProps {
  message: Message;
  isUser: boolean;
}

export function MessageBubble({ message, isUser }: MessageBubbleProps): React.ReactElement {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] px-4 py-3 rounded-xl border-[3px] border-black shadow-neo ${
          isUser
            ? 'bg-[#FFDE59] text-black rounded-br-none'
            : 'bg-white text-black rounded-bl-none'
        }`}
      >
        <div className="text-sm leading-relaxed whitespace-pre-wrap [&>p]:mb-2 [&>ul]:list-disc [&>ul]:ml-4 [&>ol]:list-decimal [&>ol]:ml-4 [&>h3]:font-black [&>h3]:text-lg [&>h4]:font-black [&>h1]:font-black [&>h2]:font-black [&>pre]:bg-black [&>pre]:text-white [&>pre]:p-2 [&>pre]:rounded-md">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
        <p
          className={`text-xs mt-1 ${
            isUser ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          {formatDate(message.timestamp)}
        </p>
      </div>
    </div>
  );
}
