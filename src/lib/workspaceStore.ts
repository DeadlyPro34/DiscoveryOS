'use client';

import { create } from 'zustand';
import { Workspace } from '@/types/workspace';
import { MOCK_WORKSPACES } from './mock-data/workspaces';

interface WorkspaceStore {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  createWorkspace: (workspace: Omit<Workspace, 'id' | 'createdDate' | 'projectsCount'>) => void;
  updateWorkspace: (id: string, updates: Partial<Workspace>) => void;
  deleteWorkspace: (id: string) => void;
  switchWorkspace: (id: string) => void;
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  workspaces: MOCK_WORKSPACES,
  currentWorkspace: MOCK_WORKSPACES[0] ?? null,

  createWorkspace: (workspace) =>
    set((state) => ({
      workspaces: [
        ...state.workspaces,
        {
          ...workspace,
          id: `ws-${Date.now()}`,
          createdDate: new Date(),
          projectsCount: 0,
        },
      ],
    })),

  updateWorkspace: (id, updates) =>
    set((state) => ({
      workspaces: state.workspaces.map((ws) =>
        ws.id === id ? { ...ws, ...updates } : ws
      ),
      currentWorkspace:
        state.currentWorkspace?.id === id
          ? { ...state.currentWorkspace, ...updates }
          : state.currentWorkspace,
    })),

  deleteWorkspace: (id) =>
    set((state) => ({
      workspaces: state.workspaces.filter((ws) => ws.id !== id),
      currentWorkspace:
        state.currentWorkspace?.id === id ? state.workspaces[0] ?? null : state.currentWorkspace,
    })),

  switchWorkspace: (id) =>
    set((state) => ({
      currentWorkspace: state.workspaces.find((ws) => ws.id === id) ?? null,
    })),
}));
