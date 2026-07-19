/**
 * ProjectsSidebar Component
 * Left sidebar showing projects and recent chats
 */

import React, { useState } from 'react';
import type { Conversation, AIWorkspaceProject } from '@/types/ai-workspace';
import { Button } from '@/components/ui/button';
import { Plus, FolderOpen, MessageSquare, Pin } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ProjectsSidebarProps {
  projects: AIWorkspaceProject[];
  conversations: Conversation[];
  selectedProjectId?: string;
  selectedConversationId?: string;
  onProjectSelect: (projectId: string) => void;
  onConversationSelect: (conversationId: string) => void;
  onNewChat: (projectId?: string) => void;
}

export function ProjectsSidebar({
  projects,
  conversations,
  selectedProjectId,
  selectedConversationId,
  onProjectSelect,
  onConversationSelect,
  onNewChat,
}: ProjectsSidebarProps): React.ReactElement {
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(
    new Set(selectedProjectId ? [selectedProjectId] : [])
  );

  const toggleProjectExpanded = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  const pinnedConversations = conversations.filter(c => c.isPinned);
  const recentConversations = conversations
    .filter(c => !c.isPinned)
    .sort((a, b) => {
      const timeA = new Date(a.updatedAt || 0).getTime();
      const timeB = new Date(b.updatedAt || 0).getTime();
      return (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA);
    })
    .slice(0, 5);

  return (
    <div className="w-64 border-r-[1.5px] border-[#e5e5e5] flex flex-col bg-transparent h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[#e5e5e5]">
        <button
          onClick={() => onNewChat()}
          className="w-full flex items-center justify-center gap-2 h-[38px] bg-[#4DD9AC] text-black border-[3px] border-black rounded-xl px-4 text-sm font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] transition-all"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Pinned Chats */}
        {pinnedConversations.length > 0 && (
          <div className="px-2 py-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="px-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">
              Pinned
            </h3>
            <div className="space-y-1">
              {pinnedConversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => onConversationSelect(conv.id)}
                  className={`w-full text-left px-2 py-2 rounded text-sm truncate transition-colors ${
                    selectedConversationId === conv.id
                      ? 'bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-200'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex gap-2 items-center">
                    <Pin className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{conv.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        <div className="px-2 py-4">
          <h3 className="px-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">
            Projects
          </h3>
          <div className="space-y-2">
            {projects.map(project => {
              const isExpanded = expandedProjects.has(project.id);
              const projectConversations = conversations.filter(
                c => c.projectId === project.id && !c.isPinned
              );

              return (
                <div key={project.id}>
                  <button
                    onClick={() => {
                      onProjectSelect(project.id);
                      toggleProjectExpanded(project.id);
                    }}
                    className={`w-full text-left px-2 py-2 rounded text-sm transition-colors flex items-center gap-2 ${
                      selectedProjectId === project.id
                        ? 'bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-200'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <FolderOpen className="h-3 w-3 flex-shrink-0" />
                    <span className="flex-1 truncate">{project.name}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {project.uploadCount}
                    </span>
                  </button>

                  {/* Project Conversations */}
                  {isExpanded && projectConversations.length > 0 && (
                    <div className="ml-4 mt-1 space-y-1 border-l border-slate-200 dark:border-slate-700 pl-2">
                      {projectConversations.slice(0, 3).map(conv => (
                        <button
                          key={conv.id}
                          onClick={() => onConversationSelect(conv.id)}
                          className={`w-full text-left px-2 py-1 rounded text-xs truncate transition-colors ${
                            selectedConversationId === conv.id
                              ? 'bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-200'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex gap-2 items-center">
                            <MessageSquare className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{conv.title}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Chats */}
        {recentConversations.length > 0 && (
          <div className="px-2 py-4 border-t border-slate-200 dark:border-slate-700">
            <h3 className="px-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">
              Recent
            </h3>
            <div className="space-y-1">
              {recentConversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => onConversationSelect(conv.id)}
                  className={`w-full text-left px-2 py-2 rounded text-sm truncate transition-colors ${
                    selectedConversationId === conv.id
                      ? 'bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-200'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex gap-2 items-center">
                    <MessageSquare className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{conv.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
