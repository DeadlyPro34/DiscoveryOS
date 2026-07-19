'use client';

import { create } from 'zustand';
import { Project } from '@/types/project';
import { MOCK_PROJECTS } from './mock-data/projects';

interface ProjectStore {
  projects: Project[];
  currentProject: Project | null;
  createProject: (project: Omit<Project, 'id' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setCurrentProject: (id: string) => void;
  getProjectsByWorkspace: (workspaceId: string) => Project[];
  setProjects: (projects: Project[]) => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  currentProject: null,
  
  setProjects: (projects) => set({ projects }),

  createProject: (project) =>
    set((state) => ({
      projects: [
        ...state.projects,
        {
          ...project,
          id: `proj-${Date.now()}`,
          updatedAt: new Date(),
        },
      ],
    })),

  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((proj) =>
        proj.id === id ? { ...proj, ...updates, updatedAt: new Date() } : proj
      ),
      currentProject:
        state.currentProject?.id === id
          ? { ...state.currentProject, ...updates, updatedAt: new Date() }
          : state.currentProject,
    })),

  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((proj) => proj.id !== id),
      currentProject: state.currentProject?.id === id ? null : state.currentProject,
    })),

  setCurrentProject: (id) =>
    set((state) => ({
      currentProject: state.projects.find((proj) => proj.id === id) ?? null,
    })),

  getProjectsByWorkspace: (workspaceId) => {
    const state = get();
    return state.projects.filter((proj) => proj.workspaceId === workspaceId);
  },
}));
