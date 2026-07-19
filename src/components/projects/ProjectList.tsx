'use client';

import React from 'react';
import { FileText, Lightbulb, MoreVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Project } from '@/types/project';
import { formatRelativeTime } from '@/lib/utils/dateHelpers';

interface ProjectListProps {
  projects: Project[];
  onSelectProject?: (project: Project) => void;
  onEditProject?: (project: Project) => void;
  onDeleteProject?: (projectId: string) => void;
}

const statusVariantMap: Record<Project['status'], 'default' | 'secondary' | 'success' | 'warning' | 'info'> = {
  'Research': 'info',
  'Processing': 'warning',
  'Completed': 'success',
  'Archived': 'secondary',
};

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  onSelectProject,
  onEditProject,
  onDeleteProject,
}) => {
  return (
    <div className="space-y-2">
      {projects.map((project) => (
        <div
          key={project.id}
          className="flex items-center gap-4 rounded-xl border-[3px] border-black bg-white p-4 cursor-pointer transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px]"
          onClick={() => onSelectProject?.(project)}
        >
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm">{project.name}</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 mt-0.5">
              {project.description || 'No description'}
            </p>
          </div>

          <Badge variant={statusVariantMap[project.status]}>
            {project.status}
          </Badge>

          <div className="hidden sm:flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <FileText className="h-4 w-4" />
              <span>{project.uploadCount}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <Lightbulb className="h-4 w-4" />
              <span>{project.insightsCount}</span>
            </div>
            <div className="text-xs text-gray-500 w-20 text-right">
              {formatRelativeTime(project.updatedAt)}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEditProject && (
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  onEditProject(project);
                }}>
                  Edit
                </DropdownMenuItem>
              )}
              {onDeleteProject && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteProject(project.id);
                    }}
                    className="text-red-600 dark:text-red-400"
                  >
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  );
};
