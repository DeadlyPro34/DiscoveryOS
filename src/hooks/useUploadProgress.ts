'use client';

import { useCallback, useState } from 'react';
import { useUploads } from './useUploads';
import { simulateFileUpload } from '@/lib/utils/uploadHelpers';

export function useUploadProgress(projectId?: string) {
  const uploads = useUploads(projectId);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = useCallback(
    async (file: File) => {
      const { updateDocumentProgress, updateDocumentStatus, completeDocument } =
        uploads;

      try {
        setIsUploading(true);
        updateDocumentStatus(file.name, 'Uploading');

        await simulateFileUpload(
          file.size,
          (progress) => {
            updateDocumentProgress(file.name, progress);
          },
          () => {
            completeDocument(file.name, {
              uploadedAt: new Date(),
              preview: `Uploaded: ${file.name}`,
            });
          }
        );
      } catch (error) {
        updateDocumentStatus(file.name, 'Failed');
        console.error('Upload failed:', error);
      } finally {
        setIsUploading(false);
      }
    },
    [uploads]
  );

  return {
    isUploading,
    uploadFile,
    ...uploads,
  };
}
