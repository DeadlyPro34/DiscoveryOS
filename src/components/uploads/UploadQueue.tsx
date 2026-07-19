'use client';

import React from 'react';
import { Document } from '@/types/uploads';
import { DocumentCard } from './DocumentCard';

interface UploadQueueProps {
  documents: Document[];
  onRetry: (id: string) => void;
  onDelete: (id: string) => void;
}

export function UploadQueue({
  documents,
  onRetry,
  onDelete,
}: UploadQueueProps) {
  const activeDocuments = documents.filter(
    (d) =>
      d.status === 'Waiting' ||
      d.status === 'Uploading' ||
      d.status === 'Processing'
  );

  if (activeDocuments.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
        Upload Queue ({activeDocuments.length})
      </h3>
      <div className="space-y-2">
        {activeDocuments.map((doc) => (
          <DocumentCard
            key={doc.id}
            document={doc}
            onRetry={onRetry}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
