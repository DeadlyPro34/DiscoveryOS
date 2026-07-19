'use client';

import { useWorkspaceStore } from '@/lib/workspaceStore';

export const useWorkspace = () => {
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);
  const createWorkspace = useWorkspaceStore((state) => state.createWorkspace);
  const updateWorkspace = useWorkspaceStore((state) => state.updateWorkspace);
  const deleteWorkspace = useWorkspaceStore((state) => state.deleteWorkspace);
  const switchWorkspace = useWorkspaceStore((state) => state.switchWorkspace);

  return {
    workspaces,
    currentWorkspace,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    switchWorkspace,
  };
};
