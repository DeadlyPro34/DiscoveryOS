import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LocalContextChunk {
  id: string;
  content: string;
  metadata: Record<string, unknown>;
  similarity: number;
}

interface AIContextStore {
  contextChunks: LocalContextChunk[];
  addContext: (chunks: LocalContextChunk[]) => void;
  clearContext: () => void;
}

export const useAIContextStore = create<AIContextStore>()(
  persist(
    (set) => ({
      contextChunks: [] as LocalContextChunk[],
      addContext: (chunks) =>
        set((state) => ({
          contextChunks: [...state.contextChunks, ...chunks],
        })),
      clearContext: () => set({ contextChunks: [] }),
    }),
    {
      name: 'discoveryos-ai-context',
    }
  )
);
