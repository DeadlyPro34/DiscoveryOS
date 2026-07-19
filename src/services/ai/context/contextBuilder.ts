import { VectorSearchResult } from '../database/supabase';

/**
 * Chat message format
 */
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Builds the context prompt combining retrieved chunks and history
 */
export class ContextBuilder {
  /**
   * Builds the prompt string with citations and context
   */
  buildContext(query: string, chunks: VectorSearchResult[], conversationHistory: ChatMessage[], projectName?: string): string {
    let contextStr = `Project: ${projectName || 'Unknown'}\n\n`;
    
    if (chunks.length > 0) {
      contextStr += `Available Context:\n`;
      chunks.forEach((chunk, idx) => {
        const sourceName = chunk.metadata?.source || chunk.id;
        contextStr += `[${idx + 1}] "${chunk.content}" - Source: ${sourceName}\n\n`;
      });
    }

    if (conversationHistory.length > 0) {
      contextStr += `Previous Conversation:\n`;
      conversationHistory.slice(-5).forEach(msg => {
        contextStr += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
      });
      contextStr += `\n`;
    }

    contextStr += `Current Query: ${query}`;
    
    return contextStr;
  }
}

let instance: ContextBuilder | null = null;

/**
 * Gets the ContextBuilder instance
 */
export function getContextBuilder(): ContextBuilder {
  if (!instance) {
    instance = new ContextBuilder();
  }
  return instance;
}
