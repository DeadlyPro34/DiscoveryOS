/**
 * ChatHeader Component
 * Header with chat title and actions
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { MoreVertical, Trash2, Pin } from 'lucide-react';

interface ChatHeaderProps {
  title: string;
  isPinned?: boolean;
  onDelete?: () => void;
  onTogglePin?: () => void;
}

export function ChatHeader({
  title,
  isPinned = false,
  onDelete,
  onTogglePin,
}: ChatHeaderProps): React.ReactElement {
  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950">
      <div className="flex-1">
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h1>
      </div>

      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onTogglePin}
          className={isPinned ? 'text-blue-500' : ''}
          title={isPinned ? 'Unpin chat' : 'Pin chat'}
        >
          <Pin className="h-4 w-4" fill={isPinned ? 'currentColor' : 'none'} />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="text-slate-500 hover:text-red-500"
          title="Delete chat"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
