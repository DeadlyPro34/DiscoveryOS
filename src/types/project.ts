export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Research' | 'Processing' | 'Completed' | 'Archived';
  uploadCount: number;
  insightsCount: number;
  lastUpdated: Date;
  workspaceId: string;
}
