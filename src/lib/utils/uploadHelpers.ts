/**
 * Generate a mock upload ID
 */
export function generateMockUploadId(): string {
  return `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Simulate a file upload with realistic timing based on file size
 * Duration: 2-10 seconds scaled by file size
 */
export async function simulateFileUpload(
  fileSizeInBytes: number,
  onProgress: (progress: number) => void,
  onComplete: () => void,
  onError?: (error: string) => void
): Promise<void> {
  // Calculate duration based on file size
  // Small files (< 1MB): 2-3 seconds
  // Medium files (1-5MB): 4-6 seconds
  // Large files (> 5MB): 7-10 seconds
  let duration = 2000; // minimum 2 seconds

  if (fileSizeInBytes > 5000000) {
    duration = 7000 + Math.random() * 3000; // 7-10 seconds
  } else if (fileSizeInBytes > 1000000) {
    duration = 4000 + Math.random() * 2000; // 4-6 seconds
  } else {
    duration = 2000 + Math.random() * 1000; // 2-3 seconds
  }

  return new Promise((resolve) => {
    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 99);

      onProgress(Math.round(progress));

      if (elapsed >= duration) {
        clearInterval(progressInterval);
        onProgress(100);
        onComplete();
        resolve();
      }
    }, 100);

    // Simulate random errors (5% chance)
    if (Math.random() < 0.05) {
      setTimeout(() => {
        clearInterval(progressInterval);
        if (onError) {
          onError('Upload failed: Network error');
        }
      }, Math.random() * duration * 0.7);
    }
  });
}

/**
 * Get estimated upload time in seconds
 */
export function getEstimatedUploadTime(fileSizeInBytes: number): number {
  if (fileSizeInBytes > 5000000) {
    return 8.5; // 7-10 seconds average
  } else if (fileSizeInBytes > 1000000) {
    return 5; // 4-6 seconds average
  } else {
    return 2.5; // 2-3 seconds average
  }
}

/**
 * Validate file type
 */
export function isValidFileType(fileName: string): boolean {
  const validExtensions = ['.pdf', '.docx', '.txt', '.csv'];
  return validExtensions.some((ext) => fileName.toLowerCase().endsWith(ext));
}

/**
 * Extract file type from filename
 */
export function getFileType(fileName: string): 'pdf' | 'docx' | 'txt' | 'csv' | null {
  const ext = fileName.toLowerCase().split('.').pop();

  switch (ext) {
    case 'pdf':
      return 'pdf';
    case 'docx':
    case 'doc':
      return 'docx';
    case 'txt':
      return 'txt';
    case 'csv':
      return 'csv';
    default:
      return null;
  }
}
