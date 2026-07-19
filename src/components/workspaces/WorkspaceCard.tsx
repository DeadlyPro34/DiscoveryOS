'use client';

import React from 'react';
import { Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Workspace } from '@/types/workspace';
import { cn } from '@/lib/utils/cn';

interface WorkspaceCardProps {
  workspace: Workspace;
  isActive?: boolean;
}

export const WorkspaceCard: React.FC<WorkspaceCardProps> = ({ workspace, isActive = false }) => {
  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md',
        isActive && 'ring-2 ring-blue-500 shadow-md'
      )}
    >
      <CardContent className="p-4">
        <div className="mb-3 flex items-start justify-between">
          <span className="text-3xl">{workspace.logo || '🏢'}</span>
          {isActive && (
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Active
            </span>
          )}
        </div>
        <h3 className="font-semibold text-sm mb-2">{workspace.name}</h3>
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <Users className="h-3.5 w-3.5" />
          <span>{workspace.members.length} members</span>
        </div>
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-500">
          {workspace.projectsCount} projects
        </div>
      </CardContent>
    </Card>
  );
};
