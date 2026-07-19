'use client';

import { create } from 'zustand';
import { Document, DocumentStatus } from '@/types/uploads';
import { MOCK_DOCUMENTS } from './mock-data/documents';

interface UploadStore {
  documents: Document[];
  addDocument: (document: Document) => void;
  updateDocumentProgress: (id: string, progress: number) => void;
  updateDocumentStatus: (id: string, status: DocumentStatus) => void;
  completeDocument: (
    id: string,
    data?: {
      uploadedAt?: Date;
      extractedText?: string;
      preview?: string;
    }
  ) => void;
  deleteDocument: (id: string) => void;
  getProjectDocuments: (projectId: string) => Document[];
  retryUpload: (id: string) => void;
}

export const useUploadStore = create<UploadStore>((set, get) => ({
  documents: [],

  addDocument: (document) =>
    set((state) => ({
      documents: [document, ...state.documents],
    })),

  updateDocumentProgress: (id, progress) =>
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id ? { ...doc, uploadProgress: progress } : doc
      ),
    })),

  updateDocumentStatus: (id, status) =>
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id ? { ...doc, status } : doc
      ),
    })),

  completeDocument: (id, data) =>
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id
          ? {
              ...doc,
              status: 'Completed' as const,
              uploadProgress: 100,
              uploadedAt: data?.uploadedAt || new Date(),
              extractedText: data?.extractedText || doc.extractedText,
              preview: data?.preview || doc.preview,
            }
          : doc
      ),
    })),

  deleteDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((doc) => doc.id !== id),
    })),

  getProjectDocuments: (projectId) => {
    const state = get();
    return state.documents.filter((doc) => doc.projectId === projectId);
  },

  retryUpload: (id) =>
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id
          ? { ...doc, status: 'Waiting' as const, uploadProgress: 0 }
          : doc
      ),
    })),
}));
