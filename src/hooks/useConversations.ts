import { useState, useEffect, useCallback } from 'react';
import type { Conversation, Message } from '@/types/ai-workspace';

const STORAGE_KEY = 'discoveryos_ai_conversations';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Fix dates
        const typed = parsed.map((c: any) => ({
          ...c,
          createdAt: new Date(c.createdAt),
          updatedAt: new Date(c.updatedAt),
          messages: c.messages.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          }))
        }));
        setConversations(typed);
      }
    } catch (e) {
      console.error('Failed to load conversations', e);
    }
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (e) {
      console.error('Failed to save conversations', e);
    }
  }, [conversations]);

  const createConversation = useCallback((title: string = 'New Conversation', projectId?: string) => {
    const newConv: Conversation = {
      id: crypto.randomUUID(),
      title,
      projectId,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isPinned: false,
    };
    setConversations(prev => [newConv, ...prev]);
    setCurrentConversation(newConv);
    return newConv;
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    setCurrentConversation(prev => (prev?.id === id ? null : prev));
  }, []);

  const renameConversation = useCallback((id: string, newTitle: string) => {
    setConversations(prev => prev.map(c => 
      c.id === id ? { ...c, title: newTitle, updatedAt: new Date() } : c
    ));
    setCurrentConversation(prev => (prev?.id === id ? { ...prev, title: newTitle, updatedAt: new Date() } : prev));
  }, []);

  const pinConversation = useCallback((id: string, isPinned: boolean) => {
    setConversations(prev => prev.map(c => 
      c.id === id ? { ...c, isPinned, updatedAt: new Date() } : c
    ));
    setCurrentConversation(prev => (prev?.id === id ? { ...prev, isPinned, updatedAt: new Date() } : prev));
  }, []);

  const loadConversation = useCallback((id: string) => {
    const conv = conversations.find(c => c.id === id);
    if (conv) {
      setCurrentConversation(conv);
    }
  }, [conversations]);

  const updateCurrentConversationMessages = useCallback((messages: Message[]) => {
    if (!currentConversation) return;
    
    const updatedConv = {
      ...currentConversation,
      messages,
      updatedAt: new Date(),
      // Auto-generate title for new conversations
      title: currentConversation.title === 'New Conversation' && messages.length > 0 
        ? messages[0].content.substring(0, 30) + '...'
        : currentConversation.title
    };
    
    setCurrentConversation(updatedConv);
    setConversations(prev => prev.map(c => 
      c.id === currentConversation.id ? updatedConv : c
    ));
  }, [currentConversation]);

  const searchConversations = useCallback((query: string) => {
    if (!query.trim()) return conversations;
    const lowerQuery = query.toLowerCase();
    return conversations.filter(c => 
      c.title.toLowerCase().includes(lowerQuery) || 
      c.messages.some(m => m.content.toLowerCase().includes(lowerQuery))
    );
  }, [conversations]);

  return {
    conversations,
    currentConversation,
    createConversation,
    deleteConversation,
    renameConversation,
    pinConversation,
    loadConversation,
    updateCurrentConversationMessages,
    searchConversations,
  };
}
