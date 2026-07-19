'use client';

import React, { useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import { useConversations } from '@/hooks/useConversations';
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

  // Auto-create a conversation when first message is sent
  useEffect(() => {
    if (messages.length > 0 && !currentConversation) {
      createConversation(messages[0].content.substring(0, 40) + '...');
    }
  }, [messages, currentConversation, createConversation]);

  // Update conversation when messages change
  useEffect(() => {
    if (messages.length > 0 && currentConversation) {
      updateCurrentConversationMessages(messages);
    }
  }, [messages, currentConversation, updateCurrentConversationMessages]);

  const handleNewChat = () => {
    clearMessages();
    createConversation();
  };

  const handleLoadConversation = (id: string) => {
    clearMessages();
    loadConversation(id);
  };

  const projects: AIWorkspaceProject[] = [
    {
      id: '1',
      name: 'Q3 Product Roadmap',
      description: 'Planning features for Q3',
      uploadCount: 5,
      evidenceCount: 152,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'User Onboarding Research',
      description: 'Improving first-time user experience',
      uploadCount: 3,
      evidenceCount: 89,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  return (
    <div className="flex h-screen bg-[#F4F4F0] overflow-hidden">
      {/* Left Sidebar (Desktop Only) */}
      <div className="hidden md:flex flex-col w-80 border-r-[3px] border-black bg-white">
        <div className="flex-1 overflow-y-auto">
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
      <div className="flex-1 flex flex-col min-w-0">
        <ConversationArea
          messages={messages}
          onSendMessage={sendMessage}
          isLoading={isStreaming}
        />
      </div>

      {/* Right Evidence Panel (Desktop Only) */}
      <div className="hidden lg:block w-96 border-l-[3px] border-black bg-white overflow-y-auto">
        {currentEvidence ? (
          <EvidencePanel
            evidence={currentEvidence}
            isLoading={isStreaming}
          />
        ) : (
          <div className="h-full flex items-center justify-center p-6 text-center">
            <div className="bg-[#FFE066] p-6 rounded-xl border-[3px] border-black shadow-neo">
              <h3 className="font-black text-xl mb-2">📊 Evidence Panel</h3>
              <p className="font-medium text-sm">
                Ask a question to see supporting customer quotes, sentiment analysis, and related themes here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
