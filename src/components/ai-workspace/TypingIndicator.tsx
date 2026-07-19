/**
 * TypingIndicator Component
 * Animated dots while AI is responding
 */

import React from 'react';

interface TypingIndicatorProps {
  className?: string;
}

export function TypingIndicator({ className = '' }: TypingIndicatorProps): React.ReactElement {
  return (
    <div className={`flex gap-1 items-center ${className}`}>
      <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-pulse" />
      <div
        className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-pulse"
        style={{ animationDelay: '0.1s' }}
      />
      <div
        className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-pulse"
        style={{ animationDelay: '0.2s' }}
      />
    </div>
  );
}
