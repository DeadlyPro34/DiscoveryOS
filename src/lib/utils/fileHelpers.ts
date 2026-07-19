import {
  File,
  FileText,
  FileJson,
  AlertCircle,
  CheckCircle,
  Clock,
  Upload,
  Loader,
} from 'lucide-react';
import type { DocumentType, DocumentStatus } from '@/types/uploads';

export function getFileIcon(type: DocumentType) {
  switch (type) {
    case 'pdf':
      return File;
    case 'docx':
      return FileText;
    case 'csv':
      return FileJson;
    case 'txt':
      return FileText;
    default:
      return File;
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function isValidFileType(fileName: string): boolean {
  const validExtensions = ['.pdf', '.docx', '.txt', '.csv'];
  return validExtensions.some((ext) => fileName.toLowerCase().endsWith(ext));
}

export function getStatusColor(status: DocumentStatus): string {
  switch (status) {
    case 'Waiting':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    case 'Uploading':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'Uploaded':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    case 'Processing':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
    case 'Completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'Failed':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
}

export function getStatusIcon(status: DocumentStatus) {
  switch (status) {
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
}

export function getFileTypeLabel(type: DocumentType): string {
  switch (type) {
    case 'pdf':
      return 'PDF';
    case 'docx':
      return 'Word Document';
    case 'csv':
      return 'CSV Spreadsheet';
    case 'txt':
      return 'Text File';
    default:
      return 'File';
  }
}
