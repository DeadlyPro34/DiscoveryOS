'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useWorkspace } from '@/hooks/useWorkspace';
import { WorkspaceCard } from './WorkspaceCard';

interface WorkspaceSwitcherProps {
  onClose: () => void;
}

export const WorkspaceSwitcher: React.FC<WorkspaceSwitcherProps> = ({ onClose }) => {
  const { workspaces, currentWorkspace, switchWorkspace } = useWorkspace();

  const handleSelect = (workspaceId: string) => {
    switchWorkspace(workspaceId);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Switch Workspace</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {workspaces.map((workspace) => (
            <div
              key={workspace.id}
              onClick={() => handleSelect(workspace.id)}
              className="cursor-pointer"
            >
              <WorkspaceCard workspace={workspace} isActive={workspace.id === currentWorkspace?.id} />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
