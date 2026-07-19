export type DocumentStatus =
  | 'Waiting'
  | 'Uploading'
  | 'Uploaded'
  | 'Processing'
  | 'Completed'
  | 'Failed';

export type DocumentType = 'pdf' | 'docx' | 'txt' | 'csv';

export interface Document {
  id: string;
  name: string;
  size: number;
  type: DocumentType;
  createdDate: Date;
  status: DocumentStatus;
  uploadProgress: number;
  projectId: string;
  uploadedAt?: Date;
  preview?: string;
  extractedText?: string;
}

export interface UploadError {
  code: string;
  message: string;
}
