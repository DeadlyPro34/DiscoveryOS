'use client';

import React from 'react';
import { FileUp, AlertCircle } from 'lucide-react';
import { Document } from '@/types/uploads';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  getFileIcon,
  formatFileSize,
  getStatusColor,
} from '@/lib/utils/fileHelpers';

interface DocumentDetailsModalProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentDetailsModal({
  document,
  isOpen,
  onClose,
}: DocumentDetailsModalProps) {
  if (!document) return null;

  const FileIcon = getFileIcon(document.type);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Document Details</DialogTitle>
          <DialogDescription>View document information and preview</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Document Header */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-800">
                <FileIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {document.name}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getStatusColor(document.status)}>
                  {document.status}
                </Badge>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatFileSize(document.size)}
                </span>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <Card className="p-4 bg-gray-50 dark:bg-gray-800">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  File Type
                </p>
                <p className="text-sm text-gray-900 dark:text-white mt-1">
                  {document.type.toUpperCase()}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  File Size
                </p>
                <p className="text-sm text-gray-900 dark:text-white mt-1">
                  {formatFileSize(document.size)}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Created
                </p>
                <p className="text-sm text-gray-900 dark:text-white mt-1">
                  {document.createdDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Status
                </p>
                <Badge className={`mt-1 ${getStatusColor(document.status)}`}>
                  {document.status}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Preview Placeholder */}
          {document.preview && (
            <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <FileUp className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Preview
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                    {document.preview}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Extracted Text Placeholder */}
          {document.extractedText && (
            <Card className="p-4">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Extracted Text Preview
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 rounded p-3 max-h-48 overflow-y-auto">
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap line-clamp-6">
                  {document.extractedText}
                </p>
              </div>
            </Card>
          )}

          {/* Processing Timeline */}
          <Card className="p-4">
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-4">
              Processing Timeline
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    File Uploaded
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {document.uploadedAt
                      ? document.uploadedAt.toLocaleString('en-US')
                      : 'Pending'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`flex-shrink-0 w-2 h-2 rounded-full ${
                    document.status === 'Processing' || document.status === 'Completed'
                      ? 'bg-green-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Processing
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {document.status === 'Processing' || document.status === 'Completed'
                      ? 'In progress or completed'
                      : 'Pending'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`flex-shrink-0 w-2 h-2 rounded-full ${
                    document.status === 'Completed'
                      ? 'bg-green-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Ready for Analysis
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {document.status === 'Completed' ? 'Available' : 'Pending'}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Error State */}
          {document.status === 'Failed' && (
            <Card className="p-4 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900 dark:text-red-100">
                    Upload Failed
                  </p>
                  <p className="text-sm text-red-800 dark:text-red-200 mt-1">
                    There was an error uploading this file. Please try again.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
