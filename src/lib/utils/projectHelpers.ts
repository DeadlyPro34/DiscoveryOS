import { Project } from '@/types/project';

export function filterProjects(
  projects: Project[],
  status?: string
): Project[] {
  if (!status) return projects;
  return projects.filter((project) => project.status === status);
}

export function sortProjects(
  projects: Project[],
  sortBy: 'name' | 'date' | 'insights' | 'uploads' = 'date'
): Project[] {
  const sorted = [...projects];

  switch (sortBy) {
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'date':
      return sorted.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
    case 'insights':
      return sorted.sort((a, b) => b.insightsCount - a.insightsCount);
    case 'uploads':
      return sorted.sort((a, b) => b.uploadCount - a.uploadCount);
    default:
      return sorted;
  }
}

export function searchProjects(
  projects: Project[],
  query: string
): Project[] {
  if (!query.trim()) return projects;

  const lowerQuery = query.toLowerCase();
  return projects.filter(
    (project) =>
      project.name.toLowerCase().includes(lowerQuery) ||
      project.description.toLowerCase().includes(lowerQuery)
  );
}
