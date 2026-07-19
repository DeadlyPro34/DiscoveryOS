'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWorkspace } from '@/hooks/useWorkspace';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';

export const WorkspaceSelector: React.FC = () => {
  const { currentWorkspace } = useWorkspace();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        className="gap-2"
        onClick={() => setIsOpen(true)}
      >
        <span className="text-lg">{currentWorkspace?.logo || '🏢'}</span>
        <span className="hidden sm:inline font-medium">{currentWorkspace?.name || 'No workspace'}</span>
        <ChevronDown className="h-4 w-4" />
      </Button>

      {isOpen && (
        <WorkspaceSwitcher onClose={() => setIsOpen(false)} />
      )}
    </>
  );
};
