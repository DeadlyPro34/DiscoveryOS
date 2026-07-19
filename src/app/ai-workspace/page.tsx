'use client';

import React, { useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import { useConversations } from '@/hooks/useConversations';
import { useProjects } from '@/hooks/useProjects';
import { ProjectsSidebar } from '@/components/ai-workspace/ProjectsSidebar';
import { ConversationArea } from '@/components/ai-workspace/ConversationArea';
import { EvidencePanel } from '@/components/ai-workspace/EvidencePanel';
import type { AIWorkspaceProject } from '@/types/ai-workspace';

export default function AIWorkspacePage() {
  const {
    messages,
    isStreaming,
    currentEvidence,
    sendMessage,
    clearMessages,
    restoreMessages,
  } = useChat();

  const {
    conversations,
    currentConversation,
    createConversation,
    deleteConversation,
    pinConversation,
    loadConversation,
    updateCurrentConversationMessages,
  } = useConversations();

  const { projects } = useProjects();

  // Auto-create a conversation when first message is sent
  useEffect(() => {
    if (messages.length > 0 && !currentConversation) {
      createConversation(messages[0].content.substring(0, 40) + '...');
    }
  }, [messages, currentConversation, createConversation]);

  // Update conversation when messages change
  useEffect(() => {
    if (messages.length > 0 && currentConversation && messages !== currentConversation.messages) {
      updateCurrentConversationMessages(messages);
    }
  }, [messages, currentConversation, updateCurrentConversationMessages]);

  const handleNewChat = () => {
    clearMessages();
    createConversation();
  };

  const handleLoadConversation = (id: string) => {
    const conv = conversations.find(c => c.id === id);
    if (conv) {
      restoreMessages(conv.messages);
      loadConversation(id);
    }
  };

  return (
    <div className="flex h-screen bg-[#f0faf5] overflow-hidden">
      {/* Left Sidebar (Desktop Only) */}
      <div className="hidden md:flex flex-col w-80 border-r-[3px] border-black bg-transparent pt-28">
        <div className="flex-1 overflow-y-auto" data-lenis-prevent>
          <ProjectsSidebar
            projects={projects}
            conversations={conversations}
            selectedProjectId={undefined}
            selectedConversationId={currentConversation?.id}
            onProjectSelect={() => {}}
            onConversationSelect={handleLoadConversation}
            onNewChat={handleNewChat}
          />
        </div>
      </div>

      {/* Center Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 pt-28">
        <ConversationArea
          messages={messages}
          onSendMessage={sendMessage}
          isLoading={isStreaming}
        />
      </div>

      {/* Right Evidence Panel (Desktop Only) */}
      <div className="hidden lg:block w-96 border-l-[3px] border-black bg-transparent overflow-y-auto pt-28" data-lenis-prevent>
        {currentEvidence ? (
          <EvidencePanel
            evidence={currentEvidence}
            isLoading={isStreaming}
          />
        ) : (
          <div className="h-full flex items-center justify-center p-6 text-center">
            <div className="bg-[#fff] p-6 rounded-[14px] border-[1.5px] border-[#e5e5e5]">
              <h3 className="font-[700] text-xl mb-2 text-[#111]">📊 Evidence Panel</h3>
              <p className="font-medium text-sm text-[#777]">
                Ask a question to see supporting customer quotes, sentiment analysis, and related themes here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
