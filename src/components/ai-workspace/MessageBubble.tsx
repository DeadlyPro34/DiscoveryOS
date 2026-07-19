/**
 * MessageBubble Component
 * Individual message in conversation
 */

import React from 'react';
import type { Message } from '@/types/ai-workspace';
import { formatDate } from '@/lib/utils/aiResponseFormatter';

interface MessageBubbleProps {
  message: Message;
  isUser: boolean;
}

export function MessageBubble({ message, isUser }: MessageBubbleProps): React.ReactElement {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-xs px-4 py-3 rounded-lg ${
          isUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
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
