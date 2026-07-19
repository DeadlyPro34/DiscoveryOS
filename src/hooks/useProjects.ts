'use client';

import { useMemo, useEffect } from 'react';
import { useProjectStore } from '@/lib/projectStore';
import { useAuthStore } from '@/lib/authStore';
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
  const createProjectState = useProjectStore((state) => state.createProject);
  const updateProjectState = useProjectStore((state) => state.updateProject);
  const deleteProjectState = useProjectStore((state) => state.deleteProject);
  const setCurrentProject = useProjectStore((state) => state.setCurrentProject);
  const getProjectsByWorkspace = useProjectStore((state) => state.getProjectsByWorkspace);
  const setProjects = useProjectStore((state) => state.setProjects);
  const dbWorkspaceId = useAuthStore((state) => state.workspaceId);

  const activeWorkspaceId = dbWorkspaceId || options.workspaceId || '1';

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const url = `/api/projects?workspaceId=${activeWorkspaceId}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } catch (err) {
        console.error('Failed to fetch projects', err);
      }
    };
    fetchProjects();
  }, [options.workspaceId, setProjects]);

  const createProject = async (project: any) => {
    // API POST
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...project, workspaceId: activeWorkspaceId })
      });
      if (res.ok) {
        const newProject = await res.json();
        createProjectState(newProject);
        return newProject;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateProject = async (id: string, updates: any) => {
    try {
      await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      updateProjectState(id, updates);
    } catch (e) {
      console.error(e);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      deleteProjectState(id);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredProjects = useMemo(() => {
    let result = projects;
    // Don't filter by mock workspace ID locally since we fetched specifically for the DB workspace
    if (options.status) {
      result = filterProjects(result, options.status);
    }
    if (options.query) {
      result = searchProjects(result, options.query);
    }
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
