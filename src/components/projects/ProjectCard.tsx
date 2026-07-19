'use client';

import React from 'react';
import { FileText, Lightbulb, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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

interface ProjectCardProps {
  project: Project;
  onSelect?: (project: Project) => void;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
}

const statusVariantMap: Record<Project['status'], 'default' | 'secondary' | 'success' | 'warning' | 'info'> = {
  'Research': 'info',
  'Processing': 'warning',
  'Completed': 'success',
  'Archived': 'secondary',
};

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onSelect,
  onEdit,
  onDelete,
}) => {
  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md h-full"
      onClick={() => onSelect?.(project)}
    >
      <CardContent className="p-4">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-sm line-clamp-2">{project.name}</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
              {project.description || 'No description'}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 -mr-1">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  onEdit(project);
                }}>
                  Edit
                </DropdownMenuItem>
              )}
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(project.id);
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

        <Badge variant={statusVariantMap[project.status]} className="mb-3">
          {project.status}
        </Badge>

        <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
          <div className="flex items-center gap-1">
            <FileText className="h-3.5 w-3.5 text-gray-500" />
            <span>{project.uploadCount} uploads</span>
          </div>
          <div className="flex items-center gap-1">
            <Lightbulb className="h-3.5 w-3.5 text-gray-500" />
            <span>{project.insightsCount} insights</span>
          </div>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-500">
          Updated {formatRelativeTime(project.lastUpdated)}
        </div>
      </CardContent>
    </Card>
  );
};
