export interface Workspace {
  id: string;
  name: string;
  logo?: string;
  members: string[];
  createdDate: Date;
  projectsCount: number;
}
