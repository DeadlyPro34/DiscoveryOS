'use client';

import React from 'react';
import {
  Trash2,
  RotateCcw,
  Download,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  Upload,
  Loader,
} from 'lucide-react';
import { Document } from '@/types/uploads';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  getFileIcon,
  formatFileSize,
  getStatusColor,
  getStatusIcon,
} from '@/lib/utils/fileHelpers';

interface DocumentCardProps {
  document: Document;
  onRetry: (id: string) => void;
  onDelete: (id: string) => void;
  onView?: (id: string) => void;
}

export function DocumentCard({
  document,
  onRetry,
  onDelete,
  onView,
}: DocumentCardProps) {
  const FileIcon = getFileIcon(document.type);
  const StatusIcon = (() => {
    switch (document.status) {
      case 'Waiting':
        return Clock;
      case 'Uploading':
        return Upload;
      case 'Uploaded':
        return CheckCircle;
      case 'Processing':
        return Loader;
      case 'Completed':
        return CheckCircle;
      case 'Failed':
        return AlertCircle;
      default:
        return Clock;
    }
  })();

  const isAnimating = document.status === 'Processing' || document.status === 'Uploading';

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0 mt-1">
            <FileIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {document.name}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formatFileSize(document.size)}
                  {document.uploadedAt && (
                    <>
                      {' '}
                      •{' '}
                      {document.uploadedAt.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: '2-digit',
                      })}
                    </>
                  )}
                </p>
              </div>

              <Badge
                className={`flex-shrink-0 ${getStatusColor(document.status)}`}
              >
                <StatusIcon
                  className={`h-3 w-3 mr-1 ${
                    isAnimating ? 'animate-spin' : ''
                  }`}
                />
                {document.status}
              </Badge>
            </div>

            {document.uploadProgress > 0 &&
              document.uploadProgress < 100 &&
              (document.status === 'Uploading' ||
                document.status === 'Processing') && (
                <div className="mt-3">
                  <Progress
                    value={document.uploadProgress}
                    max={100}
                    animated={true}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {document.uploadProgress}%
                  </p>
                </div>
              )}
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {document.status === 'Completed' && onView && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(document.id)}
              title="View document"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(document.id)}
            title="Delete document"
            className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
