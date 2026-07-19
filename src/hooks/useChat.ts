import { useState, useCallback } from 'react';
import type { Message, EvidencePanelData } from '@/types/ai-workspace';
import { useAIContextStore } from '@/lib/aiContextStore';

/**
 * Hook for managing real-time streaming chat with the /api/chat endpoint.
 * Parses evidence data from <!--EVIDENCE_START--> / <!--EVIDENCE_END--> delimiters.
 */
export function useChat(projectId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentEvidence, setCurrentEvidence] = useState<EvidencePanelData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { contextChunks } = useAIContextStore();

  const clearMessages = useCallback(() => {
    setMessages([]);
    setCurrentEvidence(null);
    setError(null);
  }, []);

  const restoreMessages = useCallback((restoredMessages: Message[]) => {
    setMessages(restoredMessages);
    setCurrentEvidence(null);
    setError(null);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    setError(null);

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    const assistantMessageId = crypto.randomUUID();

    // Add user message + empty assistant placeholder
    setMessages(prev => {
      const updated = [...prev, userMessage, {
        id: assistantMessageId,
        role: 'assistant' as const,
        content: '',
        timestamp: new Date(),
        streaming: true,
      }];
      return updated;
    });

    setIsStreaming(true);

    try {
      // Build conversation history for the API
      // OPTIMIZATION: Only send last 3 messages to stay within Groq free tier (12,000 TPM)
      const conversationHistory = messages
        .slice(-3)  // Limit to last 3 messages
        .map(m => ({
          role: m.role,
          content: m.content.substring(0, 500), // Limit content to 500 chars per message
        }));

      // Only send context chunks that match this project (or all if none selected)
      // OPTIMIZATION: Limit to top 3 chunks to reduce token count
      const relevantChunks = projectId 
        ? contextChunks.filter(c => c.metadata.projectId === projectId).slice(0, 3)
        : contextChunks.slice(0, 3);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content.substring(0, 1000), // Limit user message to 1000 chars
          conversationHistory,
          projectId,
          localContext: relevantChunks,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No readable stream available');

      const decoder = new TextDecoder();
      let streamText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        streamText += chunk;

        // Show text up to the evidence delimiter (don't show raw JSON to user)
        const evidenceStartIdx = streamText.indexOf('<!--EVIDENCE_START-->');
        const textToDisplay = evidenceStartIdx !== -1
          ? streamText.substring(0, evidenceStartIdx).trim()
          : streamText;

        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessageId
              ? { ...msg, content: textToDisplay }
              : msg
          )
        );
      }

      // After stream completes, extract evidence JSON
      const evidenceStartIdx = streamText.indexOf('<!--EVIDENCE_START-->');
      const evidenceEndIdx = streamText.indexOf('<!--EVIDENCE_END-->');
      const finalTextToDisplay = evidenceStartIdx !== -1
        ? streamText.substring(0, evidenceStartIdx).trim()
        : streamText;

      if (evidenceStartIdx !== -1 && evidenceEndIdx !== -1) {
        const evidenceJsonString = streamText
          .substring(evidenceStartIdx + '<!--EVIDENCE_START-->'.length, evidenceEndIdx)
          .trim();
        try {
          const evidenceData = JSON.parse(evidenceJsonString) as EvidencePanelData;
          setCurrentEvidence(evidenceData);
        } catch (e) {
          console.error('Failed to parse evidence JSON:', e);
        }
      }

      // Finalize the assistant message
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMessageId
            ? { ...msg, content: finalTextToDisplay, streaming: false }
            : msg
        )
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content: `⚠️ **Error:** ${errorMessage}\n\nMake sure your \`GROQ_API_KEY\` is set in \`.env.local\` and the server is running.`,
                streaming: false,
              }
            : msg
        )
      );
    } finally {
      setIsStreaming(false);
    }
  }, [messages]);

  return {
    messages,
    isStreaming,
    currentEvidence,
    error,
    sendMessage,
    clearMessages,
    restoreMessages,
  };
}
