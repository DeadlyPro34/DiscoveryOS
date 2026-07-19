export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Research' | 'Processing' | 'Completed' | 'Archived';
  uploadCount: number;
  insightsCount: number;
  updatedAt: Date;
  workspaceId: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
