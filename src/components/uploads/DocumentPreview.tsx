'use client';

import React from 'react';
import { Document } from '@/types/uploads';
import { getFileIcon, getFileTypeLabel } from '@/lib/utils/fileHelpers';
import { Card } from '@/components/ui/card';

interface DocumentPreviewProps {
  document: Document;
}

export function DocumentPreview({ document }: DocumentPreviewProps) {
  const FileIcon = getFileIcon(document.type);
  const typeLabel = getFileTypeLabel(document.type);

  return (
    <Card className="p-8 flex flex-col items-center justify-center min-h-64 bg-gray-50 dark:bg-gray-800">
      <FileIcon className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
        {typeLabel}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        {document.name}
      </p>

      {document.status === 'Completed' && (
        <div className="mt-4 text-center">
          <p className="text-xs text-green-600 dark:text-green-400">
            ✓ Ready for analysis
          </p>
        </div>
      )}

      {document.status === 'Processing' && (
        <div className="mt-4 animate-pulse">
          <p className="text-xs text-blue-600 dark:text-blue-400">
            Processing document...
          </p>
        </div>
      )}
    </Card>
  );
}
