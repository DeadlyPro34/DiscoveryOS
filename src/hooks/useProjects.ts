'use client';

import { useMemo } from 'react';
import { useProjectStore } from '@/lib/projectStore';
import { filterProjects, sortProjects, searchProjects } from '@/lib/utils/projectHelpers';

interface UseProjectsOptions {
  workspaceId?: string;
  status?: string;
  sortBy?: 'name' | 'date' | 'insights' | 'uploads';
  query?: string;
}

export const useProjects = (options: UseProjectsOptions = {}) => {
  const projects = useProjectStore((state) => state.projects);
  const currentProject = useProjectStore((state) => state.currentProject);
  const createProject = useProjectStore((state) => state.createProject);
  const updateProject = useProjectStore((state) => state.updateProject);
  const deleteProject = useProjectStore((state) => state.deleteProject);
  const setCurrentProject = useProjectStore((state) => state.setCurrentProject);
  const getProjectsByWorkspace = useProjectStore((state) => state.getProjectsByWorkspace);

  const filteredProjects = useMemo(() => {
    let result = projects;

    // Filter by workspace
    if (options.workspaceId) {
      result = result.filter((p) => p.workspaceId === options.workspaceId);
    }

    // Filter by status
    if (options.status) {
      result = filterProjects(result, options.status);
    }

    // Search
    if (options.query) {
      result = searchProjects(result, options.query);
    }

    // Sort
    result = sortProjects(result, options.sortBy ?? 'date');

    return result;
  }, [projects, options.workspaceId, options.status, options.query, options.sortBy]);

  return {
    projects: filteredProjects,
    currentProject,
    createProject,
    updateProject,
    deleteProject,
    setCurrentProject,
    getProjectsByWorkspace,
  };
};
