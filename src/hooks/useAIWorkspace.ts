/**
 * useAIWorkspace Hook
 * Manages AI workspace state and operations
 */

'use client';

import { useState, useCallback } from 'react';
import type { Conversation, Message, AIWorkspaceState } from '@/types/ai-workspace';
import { mockConversations, mockAIWorkspaceProjects } from '@/lib/mock-data/aiWorkspaceData';

/**
 * Hook for managing AI workspace state
 */
export function useAIWorkspace() {
  const [state, setState] = useState<AIWorkspaceState>({
    currentConversation: mockConversations[0] || null,
    conversations: mockConversations,
    projects: mockAIWorkspaceProjects,
    selectedProjectId: mockAIWorkspaceProjects[0]?.id,
    isLoading: false,
  });

  const createConversation = useCallback((title: string, projectId?: string) => {
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      title,
      projectId,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isPinned: false,
    };

    setState(prev => ({
      ...prev,
      conversations: [newConversation, ...prev.conversations],
      currentConversation: newConversation,
    }));

    return newConversation;
  }, []);

  const selectConversation = useCallback((conversationId: string) => {
    setState(prev => ({
      ...prev,
      currentConversation: prev.conversations.find(c => c.id === conversationId) || null,
    }));
  }, []);

  const addMessage = useCallback((message: Message) => {
    setState(prev => {
      if (!prev.currentConversation) return prev;

      const updatedConversation = {
        ...prev.currentConversation,
        messages: [...prev.currentConversation.messages, message],
        updatedAt: new Date(),
      };

      return {
        ...prev,
        currentConversation: updatedConversation,
        conversations: prev.conversations.map(c =>
          c.id === updatedConversation.id ? updatedConversation : c
        ),
      };
    });
  }, []);

  const deleteConversation = useCallback((conversationId: string) => {
    setState(prev => {
      const filtered = prev.conversations.filter(c => c.id !== conversationId);
      return {
        ...prev,
        conversations: filtered,
        currentConversation:
          prev.currentConversation?.id === conversationId ? filtered[0] || null : prev.currentConversation,
      };
    });
  }, []);

  const togglePinConversation = useCallback((conversationId: string) => {
    setState(prev => ({
      ...prev,
      conversations: prev.conversations.map(c =>
        c.id === conversationId ? { ...c, isPinned: !c.isPinned } : c
      ),
    }));
  }, []);

  const selectProject = useCallback((projectId: string) => {
    setState(prev => ({
      ...prev,
      selectedProjectId: projectId,
    }));
  }, []);

  return {
    ...state,
    createConversation,
    selectConversation,
    addMessage,
    deleteConversation,
    togglePinConversation,
    selectProject,
  };
}

/**
 * Hook for managing message streaming
 */
export function useMessageStream() {
  const [streamingContent, setStreamingContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const startStreaming = useCallback(() => {
    setIsStreaming(true);
    setStreamingContent('');
  }, []);

  const addStreamingContent = useCallback((content: string) => {
    setStreamingContent(prev => prev + content);
  }, []);

  const completeStreaming = useCallback(() => {
    setIsStreaming(false);
  }, []);

  const resetStreaming = useCallback(() => {
    setStreamingContent('');
    setIsStreaming(false);
  }, []);

  return {
    streamingContent,
    isStreaming,
    startStreaming,
    addStreamingContent,
    completeStreaming,
    resetStreaming,
  };
}

/**
 * Hook for suggested prompts
 */
export function useSuggestedPrompts() {
  const suggestedPrompts = [
    'What is our biggest customer pain point?',
    'Which feature should we build next?',
    'What are the highest revenue opportunities?',
    'Show enterprise user complaints',
    'Summarize authentication issues',
    'What problems affect retention?',
    'Generate sprint recommendations',
    'Which integration would have the most impact?',
  ];

  const getRandomPrompts = useCallback((count: number = 3) => {
    const shuffled = [...suggestedPrompts].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }, []);

  return {
    suggestedPrompts,
    getRandomPrompts,
  };
}

/**
 * Hook for follow-up questions
 */
export function useFollowUpQuestions(suggestedQuestions: string[] = []) {
  const defaultFollowUps = [
    'Can you provide more details?',
    'How does this impact our roadmap?',
    'What should we do next?',
  ];

  return {
    followUpQuestions: suggestedQuestions.length > 0 ? suggestedQuestions : defaultFollowUps,
  };
}
