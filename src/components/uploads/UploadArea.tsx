'use client';

import React, { useCallback, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { isValidFileType } from '@/lib/utils/fileHelpers';
import { formatFileSize } from '@/lib/utils/fileHelpers';

interface UploadAreaProps {
  projectId: string;
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

export function UploadArea({
  projectId,
  onFilesSelected,
  disabled = false,
}: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleDragEnter = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
    },
    [disabled]
  );

  const validateAndProcessFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((file) => isValidFileType(file.name));

    if (validFiles.length === 0) {
      console.error(
        'No valid files selected. Supported formats: PDF, DOCX, TXT, CSV'
      );
      return;
    }

    if (validFiles.length < fileArray.length) {
      console.warn(
        `${fileArray.length - validFiles.length} file(s) skipped due to unsupported format`
      );
    }

    setSelectedFiles((prev) => [...prev, ...validFiles]);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      validateAndProcessFiles(e.dataTransfer.files);
    },
    [disabled, validateAndProcessFiles]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        validateAndProcessFiles(e.target.files);
      }
    },
    [validateAndProcessFiles]
  );

  const handleUpload = useCallback(() => {
    if (selectedFiles.length > 0) {
      onFilesSelected(selectedFiles);
      setSelectedFiles([]);
    }
  }, [selectedFiles, onFilesSelected]);

  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600">
      <div
        className={`p-8 text-center transition-colors ${
          isDragging
            ? 'bg-blue-50 dark:bg-blue-950 border-blue-400'
            : 'hover:bg-gray-50 dark:hover:bg-gray-900'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-4">
            <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>

          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              Drag files here or click to browse
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Supported formats: PDF, DOCX, TXT, CSV
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Max file size: 10 MB
            </p>
          </div>

          <input
            type="file"
            multiple
            accept=".pdf,.docx,.txt,.csv"
            onChange={handleFileSelect}
            disabled={disabled}
            className="hidden"
            id={`file-input-${projectId}`}
          />

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              document.getElementById(`file-input-${projectId}`)?.click()
            }
            disabled={disabled}
          >
            Select Files
          </Button>
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Selected Files ({selectedFiles.length})
            </p>
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                    {file.name} ({formatFileSize(file.size)})
                  </span>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-gray-500 hover:text-red-500 dark:hover:text-red-400"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <Button
              onClick={handleUpload}
              disabled={disabled || selectedFiles.length === 0}
              className="w-full"
            >
              Upload {selectedFiles.length} File{selectedFiles.length !== 1 ? 's' : ''}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
