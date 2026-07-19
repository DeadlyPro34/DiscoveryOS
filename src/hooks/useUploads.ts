'use client';

import { useMemo, useState, useEffect } from 'react';
import { useUploadStore } from '@/lib/uploadStore';

export function useUploads(projectId?: string) {
  const store = useUploadStore();
  const [dbDocuments, setDbDocuments] = useState<any[]>([]);

  useEffect(() => {
    if (projectId) {
      fetch(`/api/uploads?projectId=${projectId}`)
        .then(res => res.json())
        .then(data => setDbDocuments(data))
        .catch(console.error);
    }
  }, [projectId]);

  const documents = useMemo(() => {
    // Merge DB documents with in-progress uploads from store
    const storeDocs = projectId ? store.getProjectDocuments(projectId) : store.documents;
    const allDocs = [...storeDocs, ...dbDocuments];
    // Deduplicate by ID
    return Array.from(new Map(allDocs.map(item => [item.id, item])).values());
  }, [store.documents, dbDocuments, projectId, store]);

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
