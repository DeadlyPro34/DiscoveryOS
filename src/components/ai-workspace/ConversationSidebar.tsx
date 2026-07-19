/**
 * ConversationSidebar Component
 * Alternative sidebar with just conversations and saved chats
 */

import React from 'react';
import type { Conversation } from '@/types/ai-workspace';
import { Button } from '@/components/ui/button';
import { Plus, MessageSquare, Pin, Trash2 } from 'lucide-react';

interface ConversationSidebarProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  onConversationSelect: (conversationId: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (conversationId: string) => void;
  onTogglePin: (conversationId: string) => void;
}

export function ConversationSidebar({
  conversations,
  selectedConversationId,
  onConversationSelect,
  onNewChat,
  onDeleteConversation,
  onTogglePin,
}: ConversationSidebarProps): React.ReactElement {
  const pinnedConversations = conversations.filter(c => c.isPinned);
  const recentConversations = conversations
    .filter(c => !c.isPinned)
    .sort((a, b) => {
      const timeA = new Date(a.updatedAt || 0).getTime();
      const timeB = new Date(b.updatedAt || 0).getTime();
      return (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA);
    });

  return (
    <div className="w-64 border-r border-slate-200 dark:border-slate-700 flex flex-col bg-white dark:bg-slate-950">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <Button onClick={onNewChat} className="w-full gap-2">
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Pinned */}
        {pinnedConversations.length > 0 && (
          <div className="px-2 py-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="px-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">
              Pinned
            </h3>
            <div className="space-y-1">
              {pinnedConversations.map(conv => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  isSelected={selectedConversationId === conv.id}
                  onSelect={() => onConversationSelect(conv.id)}
                  onDelete={() => onDeleteConversation(conv.id)}
                  onTogglePin={() => onTogglePin(conv.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Recent */}
        {recentConversations.length > 0 && (
          <div className="px-2 py-4">
            <h3 className="px-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">
              Recent
            </h3>
            <div className="space-y-1">
              {recentConversations.map(conv => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  isSelected={selectedConversationId === conv.id}
                  onSelect={() => onConversationSelect(conv.id)}
                  onDelete={() => onDeleteConversation(conv.id)}
                  onTogglePin={() => onTogglePin(conv.id)}
                />
              ))}
            </div>
          </div>
        )}

        {conversations.length === 0 && (
          <div className="p-4 text-center text-slate-500 dark:text-slate-400">
            <p className="text-sm">No conversations yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Individual conversation item
 */
function ConversationItem({
  conversation,
  isSelected,
  onSelect,
  onDelete,
  onTogglePin,
}: {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
}): React.ReactElement {
  const [isHovering, setIsHovering] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`group flex items-center gap-2 px-2 py-2 rounded text-sm cursor-pointer transition-colors ${
        isSelected
          ? 'bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-200'
          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}
    >
      <MessageSquare className="h-3 w-3 flex-shrink-0" />
      <button onClick={onSelect} className="flex-1 text-left truncate">
        {conversation.title}
      </button>

      {isHovering && (
        <div className="flex gap-1 flex-shrink-0">
          <button
            onClick={e => {
              e.stopPropagation();
              onTogglePin();
            }}
            className="p-0.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
            title={conversation.isPinned ? 'Unpin' : 'Pin'}
          >
            <Pin className="h-3 w-3" fill={conversation.isPinned ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={e => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-0.5 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 rounded"
            title="Delete"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}
