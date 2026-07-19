'use client';

import { useMemo } from 'react';
import { useUploadStore } from '@/lib/uploadStore';

export function useUploads(projectId?: string) {
  const store = useUploadStore();

  const documents = useMemo(() => {
    if (!projectId) {
      return store.documents;
    }
    return store.getProjectDocuments(projectId);
  }, [store.documents, projectId, store]);

  const statistics = useMemo(() => {
    return {
      total: documents.length,
      completed: documents.filter((d) => d.status === 'Completed').length,
      uploading: documents.filter((d) => d.status === 'Uploading').length,
      failed: documents.filter((d) => d.status === 'Failed').length,
      waiting: documents.filter((d) => d.status === 'Waiting').length,
      processing: documents.filter((d) => d.status === 'Processing').length,
      totalSize: documents.reduce((sum, d) => sum + d.size, 0),
    };
  }, [documents]);

  return {
    documents,
    statistics,
    addDocument: store.addDocument,
    updateDocumentProgress: store.updateDocumentProgress,
    updateDocumentStatus: store.updateDocumentStatus,
    completeDocument: store.completeDocument,
    deleteDocument: store.deleteDocument,
    retryUpload: store.retryUpload,
  };
}
