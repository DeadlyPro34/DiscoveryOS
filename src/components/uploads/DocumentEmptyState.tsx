'use client';

import React from 'react';
import { Upload, FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocumentEmptyStateProps {
  onUpload?: () => void;
}

export function DocumentEmptyState({ onUpload }: DocumentEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-4 mb-4">
        <FileQuestion className="h-8 w-8 text-blue-600 dark:text-blue-400" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        No documents yet
      </h3>

      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm mb-6">
        Start by uploading customer research documents like PDFs, Word files, CSV exports, or text
        files to begin analyzing user feedback.
      </p>

      {onUpload && (
        <Button onClick={onUpload} className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Documents
        </Button>
      )}
    </div>
  );
}
